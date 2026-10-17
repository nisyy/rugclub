'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';
import type { Artist, Taxonomy, TaxonomyKind } from '@/lib/shop/types';

const MAX_COMMISSION = 60;
const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500';

async function call(method: string, body?: unknown, query = ''): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/admin/api/shop/taxonomy${query}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) return { ok: false, error: (await res.json().catch(() => ({}))).error ?? '失敗しました' };
  return { ok: true };
}

// ─── 作家（連絡先・オンライン販売手数料つき） ───
function ArtistPanel({ items, onChanged, setError }: { items: Artist[]; onChanged: () => void; setError: (m: string) => void }) {
  const EMPTY = { name: '', phone: '', email: '', commissionPercent: '' };
  const [editing, setEditing] = useState<Artist | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function open(a: Artist | 'new') {
    setEditing(a);
    setFormError('');
    setForm(a === 'new' ? EMPTY : { name: a.name, phone: a.phone, email: a.email, commissionPercent: a.commissionPercent === null ? '' : String(a.commissionPercent) });
  }

  async function save() {
    const pct = form.commissionPercent.trim();
    if (pct === '' || !Number.isInteger(Number(pct)) || Number(pct) < 0 || Number(pct) > MAX_COMMISSION) {
      setFormError(`オンライン販売手数料は0〜${MAX_COMMISSION}%の整数で入力してください`);
      return;
    }
    setSaving(true);
    setFormError('');
    const body = { kind: 'artists', ...form, commissionPercent: Number(pct), ...(editing !== 'new' && editing ? { id: editing.id } : {}) };
    const r = await call(editing === 'new' ? 'POST' : 'PUT', body);
    setSaving(false);
    if (!r.ok) { setFormError(r.error ?? '保存に失敗しました'); return; }
    setEditing(null);
    setError('');
    onChanged();
  }

  async function remove(a: Artist) {
    if (!confirm(`「${a.name}」を削除します。よろしいですか？`)) return;
    const r = await call('DELETE', undefined, `?kind=artists&id=${encodeURIComponent(a.id)}`);
    if (!r.ok) setError(r.error ?? '削除に失敗しました'); else { setError(''); onChanged(); }
  }

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-amber-500">作家（{items.length}）</h3>
        <button onClick={() => open('new')} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg">＋ 作家を登録</button>
      </div>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-xs text-gray-600">まだ登録がありません。</li>}
        {items.map((a) => (
          <li key={a.id} className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{a.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{a.phone || '電話未登録'} · {a.email || 'メール未登録'}</p>
            </div>
            <span className={`text-xs shrink-0 px-2.5 py-1 rounded-full ${a.commissionPercent === null ? 'bg-red-900/50 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
              手数料 {a.commissionPercent === null ? '未設定（0%扱い）' : `${a.commissionPercent}%`}
            </span>
            <button className="text-xs text-gray-300 hover:text-white" onClick={() => open(a)}>編集</button>
            <button className="text-xs text-red-400 hover:text-red-300" onClick={() => remove(a)}>削除</button>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto p-4" onClick={() => setEditing(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md my-8 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">{editing === 'new' ? '作家を登録' : '作家を編集'}</h3>
            <div><label className="block text-xs text-gray-400 mb-1.5">作家名</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">電話番号</label><input className={inputCls} inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="090-1234-5678" /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">メールアドレス</label><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="artist@example.com" /></div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">オンライン販売手数料（%・0〜{MAX_COMMISSION}）</label>
              <input inputMode="numeric" className={inputCls} value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })} placeholder="例：20" />
              <p className="text-[11px] text-gray-500 mt-1">商品の税込販売価格 × この率（1円未満切り捨て）が手数料です。変更は以降の注文から反映され、過去の注文は変わりません。</p>
            </div>
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="text-sm text-gray-400 hover:text-white px-4 py-2">キャンセル</button>
              <button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg">{saving ? '保存中...' : '保存'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── カテゴリ ───
function CategoryPanel({ items, onChanged, setError }: { items: Taxonomy[]; onChanged: () => void; setError: (m: string) => void }) {
  const [name, setName] = useState('');
  async function run(method: string, body?: unknown, query = '') {
    const r = await call(method, body, query);
    if (!r.ok) { setError(r.error ?? '失敗しました'); return false; }
    setError('');
    onChanged();
    return true;
  }
  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 md:col-span-2">
      <h3 className="text-sm font-bold text-amber-500 mb-4">カテゴリ（{items.length}）</h3>
      <form className="flex gap-2 mb-4" onSubmit={async (e) => { e.preventDefault(); if (await run('POST', { kind: 'categories', name })) setName(''); }}>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="名前を入力して追加" />
        <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 rounded-lg shrink-0">追加</button>
      </form>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-xs text-gray-600">まだ登録がありません。</li>}
        {items.map((t) => (
          <li key={t.id} className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm text-white truncate">{t.name}</span>
            <button type="button" className="text-xs text-gray-300 hover:text-white" onClick={() => { const n = prompt('新しい名前', t.name); if (n && n.trim() && n !== t.name) run('PUT', { kind: 'categories' as TaxonomyKind, id: t.id, name: n }); }}>名前変更</button>
            <button type="button" className="text-xs text-red-400 hover:text-red-300" onClick={() => { if (confirm(`「${t.name}」を削除します。よろしいですか？`)) run('DELETE', undefined, `?kind=categories&id=${encodeURIComponent(t.id)}`); }}>削除</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AdminShopTaxonomyPage() {
  const [data, setData] = useState<{ artists: Artist[]; categories: Taxonomy[] }>({ artists: [], categories: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch('/admin/api/shop/taxonomy');
    if (res.ok) setData(await res.json()); else setError((await res.json().catch(() => ({}))).error ?? '読み込みに失敗しました');
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-white">作家・カテゴリ管理</h2>
        <p className="text-xs text-gray-500 mt-1 mb-8">作家の連絡先・手数料は管理画面専用で、公開サイトには表示されません。商品で使用中の項目は削除できません。</p>
        {error && <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg break-all">{error}</div>}
        {loading ? <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div> : (
          <div className="grid gap-6 md:grid-cols-2">
            <ArtistPanel items={data.artists} onChanged={load} setError={setError} />
            <CategoryPanel items={data.categories} onChanged={load} setError={setError} />
          </div>
        )}
      </main>
    </div>
  );
}
