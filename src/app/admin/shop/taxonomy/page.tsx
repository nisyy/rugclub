'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../../_components/AdminHeader';
import type { Taxonomy, TaxonomyKind } from '@/lib/shop/types';

const inputCls = 'flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500';

function Panel({ kind, title, items, onChanged, setError }: { kind: TaxonomyKind; title: string; items: Taxonomy[]; onChanged: () => void; setError: (m: string) => void }) {
  const [name, setName] = useState('');

  async function call(method: string, body?: unknown, query = '') {
    const res = await fetch(`/admin/api/shop/taxonomy${query}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? '失敗しました'); return false; }
    setError('');
    onChanged();
    return true;
  }

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-bold text-amber-500 mb-4">{title}（{items.length}）</h3>
      <form className="flex gap-2 mb-4" onSubmit={async (e) => { e.preventDefault(); if (await call('POST', { kind, name })) setName(''); }}>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="名前を入力して追加" />
        <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 rounded-lg">追加</button>
      </form>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-xs text-gray-600">まだ登録がありません。</li>}
        {items.map((t) => (
          <li key={t.id} className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm text-white truncate">{t.name}</span>
            <button type="button" className="text-xs text-gray-300 hover:text-white" onClick={() => { const n = prompt('新しい名前', t.name); if (n && n.trim() && n !== t.name) call('PUT', { kind, id: t.id, name: n }); }}>名前変更</button>
            <button type="button" className="text-xs text-red-400 hover:text-red-300" onClick={() => { if (confirm(`「${t.name}」を削除します。よろしいですか？`)) call('DELETE', undefined, `?kind=${kind}&id=${encodeURIComponent(t.id)}`); }}>削除</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AdminShopTaxonomyPage() {
  const [data, setData] = useState<{ artists: Taxonomy[]; categories: Taxonomy[] }>({ artists: [], categories: [] });
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
        <p className="text-xs text-gray-500 mt-1 mb-8">ここで登録した内容を、ショップ商品の登録画面で選択できます。商品で使用中の項目は削除できません。</p>
        {error && <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg break-all">{error}</div>}
        {loading ? <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div> : (
          <div className="grid gap-6 md:grid-cols-2">
            <Panel kind="artists" title="作家" items={data.artists} onChanged={load} setError={setError} />
            <Panel kind="categories" title="カテゴリ" items={data.categories} onChanged={load} setError={setError} />
          </div>
        )}
      </main>
    </div>
  );
}
