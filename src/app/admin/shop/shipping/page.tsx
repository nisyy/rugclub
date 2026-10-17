'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';

const inputCls = 'w-full max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500';

export default function AdminShopShippingPage() {
  const [flat, setFlat] = useState('');
  const [remote, setRemote] = useState('');
  const [free, setFree] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/admin/api/shop/shipping')
      .then((r) => r.json())
      .then((d) => {
        setFlat(d.flatFeeYen == null ? '' : String(d.flatFeeYen));
        setRemote(d.remoteFeeYen == null ? '' : String(d.remoteFeeYen));
        setFree(d.freeThresholdYen == null ? '' : String(d.freeThresholdYen));
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch('/admin/api/shop/shipping', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flatFeeYen: flat.trim() === '' ? null : Number(flat), remoteFeeYen: remote.trim() === '' ? null : Number(remote), freeThresholdYen: free.trim() === '' ? null : Number(free) }),
    });
    setMsg(res.ok ? { ok: true, text: '保存しました' } : { ok: false, text: (await res.json().catch(() => ({}))).error ?? '保存に失敗しました' });
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-white">送料設定</h2>
        <p className="text-xs text-gray-500 mt-1 mb-8">金額はすべて税込（円）。保存すると、ショップのカート・購入手続きにすぐ反映されます。</p>
        {loading ? <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div> : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm text-white mb-1.5">基本送料（円・北海道・沖縄以外）</label>
              <input inputMode="numeric" className={inputCls} value={flat} onChange={(e) => setFlat(e.target.value)} placeholder="例：500" />
              <p className="text-[11px] text-gray-500 mt-1.5">空欄のままだと「送料未確定」となり、注文を確定できません（テストモード時のみ仮送料で動作）。0円にすると全国送料無料です。</p>
            </div>
            <div>
              <label className="block text-sm text-white mb-1.5">北海道・沖縄の送料（円）</label>
              <input inputMode="numeric" className={inputCls} value={remote} onChange={(e) => setRemote(e.target.value)} placeholder="例：1200" />
              <p className="text-[11px] text-gray-500 mt-1.5">購入手続きで入力された届け先の都道府県が北海道または沖縄県の場合に適用します。空欄なら基本送料と同じです。</p>
            </div>
            <div>
              <label className="block text-sm text-white mb-1.5">送料無料になる金額（円・任意）</label>
              <input inputMode="numeric" className={inputCls} value={free} onChange={(e) => setFree(e.target.value)} placeholder="例：5000" />
              <p className="text-[11px] text-gray-500 mt-1.5">商品小計がこの金額以上で、全地域とも送料が無料になります。空欄なら常に基本送料です。</p>
            </div>
            {msg && <p className={`text-xs ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>}
            <button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg">{saving ? '保存中...' : '保存'}</button>
          </div>
        )}
      </main>
    </div>
  );
}
