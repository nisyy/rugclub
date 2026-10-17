'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';
import type { OrderRecord, OrderStatus } from '@/lib/shop/types';

const STATUS_LABEL: Record<OrderStatus, string> = { pending_payment: '決済待ち', received: '受付', packing: '梱包中', shipped: '発送済み', canceled: 'キャンセル' };
const STATUS_CLS: Record<OrderStatus, string> = {
  pending_payment: 'bg-violet-900/50 text-violet-300',
  received: 'bg-sky-900/50 text-sky-300',
  packing: 'bg-amber-900/50 text-amber-300',
  shipped: 'bg-emerald-900/50 text-emerald-300',
  canceled: 'bg-gray-800 text-gray-400',
};
const CARRIERS = ['ヤマト運輸', '日本郵便', '佐川急便', 'その他'];
const MAIL_LABEL = { sent: '送信済み', failed: '送信失敗', skipped: '未送信' } as const;
const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;
const inputCls = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500';

function ShipForm({ order, onDone }: { order: OrderRecord; onDone: () => void }) {
  const [carrier, setCarrier] = useState(order.carrier ?? CARRIERS[0]);
  const [tracking, setTracking] = useState(order.trackingNumber ?? '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function ship(notify: boolean) {
    setBusy(true);
    setMsg('');
    const res = await fetch('/admin/api/shop/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status: 'shipped', carrier, trackingNumber: tracking, notify }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(data.error ?? '更新に失敗しました'); return; }
    if (notify && data.shippedMail === 'failed') setMsg('発送済みにしましたが、通知メールの送信に失敗しました');
    onDone();
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 space-y-3">
      <p className="text-xs text-gray-300 font-semibold">発送情報</p>
      <div className="flex flex-wrap gap-2">
        <select className={inputCls} value={carrier} onChange={(e) => setCarrier(e.target.value)}>{CARRIERS.map((c) => <option key={c}>{c}</option>)}</select>
        <input className={`${inputCls} flex-1 min-w-[10rem]`} value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="追跡番号（英数字・ハイフン）" />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <button disabled={busy} onClick={() => ship(true)} className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg">
          {order.status === 'shipped' ? '追跡番号を更新して通知メールを送る' : '発送済みにして購入者へ通知メールを送る'}
        </button>
        <button disabled={busy} onClick={() => ship(false)} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs px-4 py-2 rounded-lg">通知せず保存</button>
        {order.shippedMail && <span className="text-[11px] text-gray-500">発送通知：{MAIL_LABEL[order.shippedMail]}（送信済みの場合、再送はされません）</span>}
      </div>
      {msg && <p className="text-xs text-red-400">{msg}</p>}
    </div>
  );
}

export default function AdminShopOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const seen = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await fetch('/admin/api/shop/orders');
    if (res.ok) {
      const data = (await res.json()) as OrderRecord[];
      // 自動更新で新しく入った注文を「NEW」表示する
      if (seen.current) {
        const added = data.filter((o) => !seen.current!.has(o.id)).map((o) => o.id);
        if (added.length) setFresh((f) => new Set([...f, ...added]));
      }
      seen.current = new Set(data.map((o) => o.id));
      setOrders(data);
      setError('');
      setUpdatedAt(new Date());
    } else setError((await res.json().catch(() => ({}))).error ?? '読み込みに失敗しました');
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); const t = setInterval(() => load(true), 60_000); return () => clearInterval(t); }, [load]);

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const count = (st: OrderStatus) => orders.filter((o) => o.status === st).length;

  async function restore(id: string) {
    if (!confirm('この注文の数量を商品の在庫に戻します。よろしいですか？（1回のみ実行できます）')) return;
    const res = await fetch('/admin/api/shop/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, restoreStock: true }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error ?? '在庫を戻せませんでした'); return; }
    alert(data.restored > 0 ? `在庫を${data.restored}点分戻しました` : '戻す対象の商品がありませんでした（サンプル商品など）');
    load(true);
  }

  async function setStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const res = await fetch('/admin/api/shop/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (!res.ok) { alert('ステータスの更新に失敗しました'); load(true); }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">ショップ注文管理</h2>
            <p className="text-xs text-gray-500 mt-1">{visible.length} 件 · 新しい順 · 60秒ごとに自動更新{updatedAt ? `（最終更新 ${updatedAt.toLocaleTimeString('ja-JP')}）` : ''}</p>
          </div>
          <button onClick={() => load(true)} className="text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shrink-0">更新</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {([['all', 'すべて', orders.length], ['pending_payment', STATUS_LABEL.pending_payment, count('pending_payment')], ['received', STATUS_LABEL.received, count('received')], ['packing', STATUS_LABEL.packing, count('packing')], ['shipped', STATUS_LABEL.shipped, count('shipped')], ['canceled', STATUS_LABEL.canceled, count('canceled')]] as const).map(([id, label, n]) => (
            <button key={id} onClick={() => setFilter(id)} className={`text-xs px-3.5 py-1.5 rounded-full transition-colors ${filter === id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {label} <span className="opacity-60">{n}</span>
            </button>
          ))}
        </div>
        {error && <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg break-all">{error}</div>}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">該当する注文はありません。</div>
        ) : (
          <div className="space-y-3">
            {visible.map((o) => (
              <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl">
                <button onClick={() => { setOpenId(openId === o.id ? null : o.id); setFresh((f) => { const n = new Set(f); n.delete(o.id); return n; }); }} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">
                      {o.orderNumber}
                      {fresh.has(o.id) && <span className="ml-2 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full">NEW</span>}
                      {o.testMode && <span className="ml-2 text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full">テスト注文</span>}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(o.createdAt).toLocaleString('ja-JP')} · {o.customer.name} 様</p>
                  </div>
                  <span className="text-white text-sm tabular-nums">{yen(o.totalYen)}</span>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full ${STATUS_CLS[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                </button>
                {openId === o.id && (
                  <div className="border-t border-gray-800 p-4 space-y-4 text-sm">
                    <ul className="space-y-1 text-gray-300">
                      {o.lines.map((l) => (
                        <li key={l.id}>
                          {l.name} × {l.qty}　<span className="text-gray-500">{yen(l.lineTotalYen)}</span>
                          {l.artistName && <span className="text-gray-500 text-xs">　［{l.artistName}・手数料{l.commissionPercent ?? 0}%＝{yen(l.commissionYen ?? 0)}］</span>}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-400 text-xs">小計 {yen(o.subtotalYen)} + 送料 {yen(o.shippingYen)}{o.shippingProvisional ? '（テスト用の仮送料）' : ''} = <span className="text-white">{yen(o.totalYen)}</span></p>
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <p>{o.customer.name} / {o.customer.email}</p>
                      <p>〒{o.customer.postalCode} {o.customer.prefecture}{o.customer.city} {o.customer.address2}</p>
                      <p>メール：購入者 {MAIL_LABEL[o.mail.customer]} / 店舗 {MAIL_LABEL[o.mail.shop]}</p>
                      {o.paidAt && <p>決済：クレジットカード（{new Date(o.paidAt).toLocaleString('ja-JP')}）{o.paymentIntentId ? ` / ${o.paymentIntentId}` : ''}</p>}
                      {o.shippedAt && <p>発送：{o.carrier} {o.trackingNumber}（{new Date(o.shippedAt).toLocaleString('ja-JP')}）</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-500">ステータス</label>
                      <select value={o.status} onChange={(e) => (e.target.value === 'shipped' ? setOpenId(o.id) : setStatus(o.id, e.target.value as OrderStatus))} className={inputCls}>
                        {(Object.keys(STATUS_LABEL) as OrderStatus[]).filter((s) => s !== 'pending_payment' || o.status === 'pending_payment').map((s) => <option key={s} value={s} disabled={s === 'pending_payment'}>{STATUS_LABEL[s]}</option>)}
                      </select>
                      <span className="text-[11px] text-gray-600">「発送済み」は下の発送情報から設定します</span>
                    </div>
                    {o.status !== 'canceled' && o.status !== 'pending_payment' && <ShipForm order={o} onDone={() => load(true)} />}
                    {o.status === 'pending_payment' && <p className="text-[11px] text-violet-300">お客様が決済ページで支払い中です。決済が完了すると自動で「受付」になります（30分で期限切れ。その場合は自動でキャンセルされ、在庫が戻ります）。</p>}
                    {o.paymentIssue && <p className="text-xs text-red-300 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">⚠ 要確認：{o.paymentIssue}。Stripeのダッシュボードで決済内容を確認してください。</p>}
                {o.status === 'canceled' && (
                      <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                        <p className="text-xs text-gray-300 font-semibold">在庫の調整</p>
                        <p className="text-[11px] text-gray-500">キャンセルしても在庫は自動では戻りません。必要な場合は下のボタンで、この注文の数量を在庫に戻せます（1回のみ）。個別の調整は商品管理の在庫欄からも行えます。</p>
                        <button disabled={!!o.stockRestored} onClick={() => restore(o.id)} className="bg-sky-700 hover:bg-sky-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs font-semibold px-4 py-2 rounded-lg">
                          {o.stockRestored ? '在庫を戻し済み' : 'この注文の数量を在庫に戻す'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
