'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';
import { LEGAL_LABELS, type LegalSettings } from '@/lib/shop/legalConfig';

const FIELDS: { key: keyof LegalSettings; hint?: string; long?: boolean; required: boolean }[] = [
  { key: 'sellerName', hint: '事業者（個人の場合は氏名、法人は法人名）。屋号やサイト名だけは不可です', required: true },
  { key: 'representative', hint: '運営責任者の氏名', required: true },
  { key: 'address', required: true },
  { key: 'phone', required: true },
  { key: 'email', required: true },
  { key: 'paymentMethod', required: true },
  { key: 'paymentTiming', required: true },
  { key: 'deliveryTime', hint: '例：ご注文確認後、3〜7営業日以内に発送します', long: true, required: true },
  { key: 'returnPolicy', hint: '返品・交換の可否と条件、期限、送料の負担、キャンセルの扱い（一点物は返品不可の場合はその旨）を具体的に', long: true, required: true },
  { key: 'note', hint: '任意。その他の注意事項', long: true, required: false },
];
const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500';

export default function AdminShopLegalPage() {
  const [s, setS] = useState<LegalSettings | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/admin/api/shop/legal').then((r) => r.json()).then((d) => { setS(d.settings); setMissing(d.missing); });
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    setMsg(null);
    const res = await fetch('/admin/api/shop/legal', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
    const d = await res.json().catch(() => ({}));
    if (res.ok) { setMissing(d.missing); setMsg({ ok: true, text: '保存しました' }); } else setMsg({ ok: false, text: d.error ?? '保存に失敗しました' });
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-white">特定商取引法に基づく表記</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">公開ページ <a className="underline" href="/tokushoho" target="_blank" rel="noopener noreferrer">/tokushoho</a> と、購入手続きの最終確認画面に表示されます。送料は「送料設定」の内容が自動で反映されます。</p>
        {missing.length > 0 && (
          <div className="mb-6 bg-amber-950/50 border border-amber-800 text-amber-200 text-xs px-4 py-3 rounded-lg leading-relaxed">
            未入力の必須項目：{missing.map((k) => LEGAL_LABELS[k as keyof LegalSettings]).join('、')}<br />
            すべて入力するまで、本番では注文を確定できません（テストモードを除く）。
          </div>
        )}
        {!s ? <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div> : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-white mb-1.5">{LEGAL_LABELS[f.key]}{f.required ? <span className="text-red-400 text-xs ml-1">必須</span> : <span className="text-gray-500 text-xs ml-1">任意</span>}</label>
                {f.long
                  ? <textarea rows={4} className={inputCls} value={s[f.key]} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} />
                  : <input className={inputCls} value={s[f.key]} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} />}
                {f.hint && <p className="text-[11px] text-gray-500 mt-1">{f.hint}</p>}
              </div>
            ))}
            {msg && <p className={`text-xs ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>}
            <button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg">{saving ? '保存中...' : '保存'}</button>
          </div>
        )}
      </main>
    </div>
  );
}
