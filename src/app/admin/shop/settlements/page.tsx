'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';
import type { Artist, OrderRecord, OrderStatus } from '@/lib/shop/types';

const STATUS_LABEL: Record<OrderStatus, string> = { received: '受付', packing: '梱包中', shipped: '発送済み', canceled: 'キャンセル' };
const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;
const NONE = '__none';

interface Row { order: OrderRecord; sales: number; commission: number; payout: number; items: string[]; settled: boolean }

export default function AdminShopSettlementsPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [includeTest, setIncludeTest] = useState(false);
  const [artistFilter, setArtistFilter] = useState('all');
  const [view, setView] = useState<'unsettled' | 'settled' | 'all'>('unsettled');

  const load = useCallback(async () => {
    const [o, t] = await Promise.all([fetch('/admin/api/shop/orders'), fetch('/admin/api/shop/taxonomy')]);
    if (o.ok) setOrders(await o.json()); else setError((await o.json().catch(() => ({}))).error ?? '読み込みに失敗しました');
    if (t.ok) setArtists((await t.json()).artists);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // 作家ごと × 注文ごとの売上・手数料・支払額（キャンセル注文は除外）
  const groups = useMemo(() => {
    const map = new Map<string, { name: string; rows: Row[] }>();
    for (const o of orders) {
      if (o.status === 'canceled' || (o.testMode && !includeTest)) continue;
      const byArtist = new Map<string, { name: string; lines: OrderRecord['lines'] }>();
      for (const l of o.lines) {
        const id = l.artistId ?? NONE;
        const g = byArtist.get(id) ?? { name: l.artistName ?? '作家未設定', lines: [] };
        g.lines.push(l);
        byArtist.set(id, g);
      }
      for (const [id, g] of byArtist) {
        const row: Row = {
          order: o,
          sales: g.lines.reduce((s, l) => s + l.lineTotalYen, 0),
          commission: g.lines.reduce((s, l) => s + (l.commissionYen ?? 0), 0),
          payout: g.lines.reduce((s, l) => s + (l.payoutYen ?? l.lineTotalYen), 0),
          items: g.lines.map((l) => `${l.name} × ${l.qty}`),
          settled: !!o.settlements?.[id],
        };
        const grp = map.get(id) ?? { name: g.name, rows: [] };
        grp.rows.push(row);
        map.set(id, grp);
      }
    }
    return Array.from(map, ([id, g]) => ({ id, ...g })).sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  }, [orders, includeTest]);

  async function toggle(orderId: string, artistId: string, settled: boolean) {
    setOrders((prev) => prev.map((o) => (o.id !== orderId ? o : { ...o, settlements: { ...o.settlements, ...(settled ? { [artistId]: { settledAt: new Date().toISOString() } } : {}) } })));
    if (!settled) setOrders((prev) => prev.map((o) => { if (o.id !== orderId) return o; const s = { ...o.settlements }; delete s[artistId]; return { ...o, settlements: s }; }));
    const res = await fetch('/admin/api/shop/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, settle: { artistId, settled } }) });
    if (!res.ok) { alert('精算状況の更新に失敗しました'); load(); }
  }

  const shown = groups.filter((g) => artistFilter === 'all' || g.id === artistFilter);

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-white">作家精算管理</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">手数料＝税込販売額 × 注文時の手数料率（1円未満切り捨て）。送料は含みません。キャンセル注文は集計から除外します。</p>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white">
            <option value="all">すべての作家</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          {([['unsettled', '未精算'], ['settled', '精算済み'], ['all', 'すべて']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} className={`text-xs px-3.5 py-1.5 rounded-full ${view === id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{label}</button>
          ))}
          <label className="flex items-center gap-2 text-xs text-gray-400 ml-auto"><input type="checkbox" checked={includeTest} onChange={(e) => setIncludeTest(e.target.checked)} />テスト注文を含める</label>
        </div>
        {error && <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg break-all">{error}</div>}
        {loading ? <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div> : shown.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">集計対象の注文はありません。</div>
        ) : (
          <div className="space-y-8">
            {shown.map((g) => {
              const a = artists.find((x) => x.id === g.id);
              const rows = g.rows.filter((r) => view === 'all' || (view === 'settled') === r.settled).sort((x, y) => y.order.createdAt.localeCompare(x.order.createdAt));
              const unsettledPayout = g.rows.filter((r) => !r.settled).reduce((s, r) => s + r.payout, 0);
              const settledPayout = g.rows.filter((r) => r.settled).reduce((s, r) => s + r.payout, 0);
              return (
                <section key={g.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">{g.name}</h3>
                      {a && <p className="text-[11px] text-gray-500 mt-1">{a.phone || '電話未登録'} · {a.email || 'メール未登録'} · 現在の手数料 {a.commissionPercent === null ? '未設定' : `${a.commissionPercent}%`}</p>}
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-amber-400">未精算の支払額 <span className="text-base font-bold tabular-nums">{yen(unsettledPayout)}</span></p>
                      <p className="text-gray-500">精算済み {yen(settledPayout)}</p>
                    </div>
                  </div>
                  {rows.length === 0 ? <p className="text-xs text-gray-600">該当する注文はありません。</p> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="text-gray-500 text-left border-b border-gray-800">
                          <th className="py-2 pr-3 font-normal">注文</th><th className="py-2 pr-3 font-normal">商品</th>
                          <th className="py-2 pr-3 font-normal text-right">売上</th><th className="py-2 pr-3 font-normal text-right">手数料</th><th className="py-2 pr-3 font-normal text-right">支払額</th><th className="py-2 font-normal text-center">精算済み</th>
                        </tr></thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.order.id} className="border-b border-gray-800/60 text-gray-300 align-top">
                              <td className="py-2.5 pr-3 whitespace-nowrap">{r.order.orderNumber}<br /><span className="text-gray-500">{new Date(r.order.createdAt).toLocaleDateString('ja-JP')} · {STATUS_LABEL[r.order.status]}{r.order.testMode ? ' · テスト' : ''}</span></td>
                              <td className="py-2.5 pr-3">{r.items.map((i) => <p key={i}>{i}</p>)}</td>
                              <td className="py-2.5 pr-3 text-right tabular-nums">{yen(r.sales)}</td>
                              <td className="py-2.5 pr-3 text-right tabular-nums text-gray-400">{yen(r.commission)}</td>
                              <td className="py-2.5 pr-3 text-right tabular-nums text-white">{yen(r.payout)}</td>
                              <td className="py-2.5 text-center">{g.id !== NONE && <input type="checkbox" checked={r.settled} onChange={(e) => toggle(r.order.id, g.id, e.target.checked)} aria-label="精算済み" />}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
