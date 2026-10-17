'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';
import type { OrderRecord, OrderStatus } from '@/lib/shop/types';

const STATUS_LABEL: Record<OrderStatus, string> = { received: '受付', shipped: '発送済み', canceled: 'キャンセル' };
const MAIL_LABEL = { sent: '送信済み', failed: '送信失敗', skipped: '未送信' } as const;
const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

export default function AdminShopOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/admin/api/shop/orders');
    if (res.ok) { setOrders(await res.json()); setError(''); }
    else setError((await res.json().catch(() => ({}))).error ?? '読み込みに失敗しました');
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const res = await fetch('/admin/api/shop/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (!res.ok) { alert('ステータスの更新に失敗しました'); load(); }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-white">ショップ注文管理</h2>
        <p className="text-xs text-gray-500 mt-1 mb-8">{orders.length} 件 · 新しい順（最大200件）</p>
        {error && <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg break-all">{error}</div>}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">注文はまだありません。</div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl">
                <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">
                      {o.orderNumber}
                      {o.testMode && <span className="ml-2 text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full">テスト注文</span>}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(o.createdAt).toLocaleString('ja-JP')} · {o.customer.name} 様</p>
                  </div>
                  <span className="text-white text-sm tabular-nums">{yen(o.totalYen)}</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-800 text-gray-300">{STATUS_LABEL[o.status]}</span>
                </button>
                {openId === o.id && (
                  <div className="border-t border-gray-800 p-4 space-y-4 text-sm">
                    <ul className="space-y-1 text-gray-300">
                      {o.lines.map((l) => <li key={l.id}>{l.name} × {l.qty}　<span className="text-gray-500">{yen(l.lineTotalYen)}</span></li>)}
                    </ul>
                    <p className="text-gray-400 text-xs">小計 {yen(o.subtotalYen)} + 送料 {yen(o.shippingYen)}{o.testMode ? '（テスト用の仮送料）' : ''} = <span className="text-white">{yen(o.totalYen)}</span></p>
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <p>{o.customer.name} / {o.customer.email}</p>
                      <p>〒{o.customer.postalCode} {o.customer.prefecture}{o.customer.city} {o.customer.address2}</p>
                      <p>メール：購入者 {MAIL_LABEL[o.mail.customer]} / 店舗 {MAIL_LABEL[o.mail.shop]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-500">ステータス</label>
                      <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white">
                        {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                    </div>
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
