'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import ImageUploadField from '../_components/ImageUploadField';
import type { AdminProduct, ProductStatus, Taxonomy, TaxonomyKind } from '@/lib/shop/types';

const STATUS_LABEL: Record<ProductStatus, string> = { on_sale: '販売中', sold_out: '売り切れ', hidden: '非公開' };
const STATUS_CLS: Record<ProductStatus, string> = {
  on_sale: 'bg-emerald-900/50 text-emerald-300',
  sold_out: 'bg-amber-900/50 text-amber-300',
  hidden: 'bg-gray-800 text-gray-400',
};

interface Form { name: string; description: string; imageUrl: string; priceYen: string; stock: string; status: ProductStatus; artistId: string; categoryId: string }
const EMPTY: Form = { name: '', description: '', imageUrl: '', priceYen: '', stock: '', status: 'on_sale', artistId: '', categoryId: '' };
const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500';

export default function AdminShopProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [usingSamples, setUsingSamples] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [tax, setTax] = useState<{ artists: Taxonomy[]; categories: Taxonomy[] }>({ artists: [], categories: [] });

  const loadTax = useCallback(async () => {
    const res = await fetch('/admin/api/shop/taxonomy');
    if (res.ok) setTax(await res.json());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const res = await fetch('/admin/api/shop/products');
    if (res.ok) {
      const data = (await res.json()) as { products: AdminProduct[]; usingSamples: boolean };
      setProducts(data.products);
      setUsingSamples(data.usingSamples);
    } else {
      setLoadError((await res.json().catch(() => ({}))).error ?? '読み込みに失敗しました');
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); loadTax(); }, [load, loadTax]);

  function openNew() { setEditing(null); setForm(EMPTY); setSaveError(''); setOpen(true); }
  function openEdit(p: AdminProduct) {
    setEditing(p);
    setForm({ name: p.name, description: p.description, imageUrl: p.imageUrl ?? '', priceYen: String(p.priceYen), stock: String(p.stock), status: p.status, artistId: p.artistId ?? '', categoryId: p.categoryId ?? '' });
    setSaveError('');
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setSaveError('');
    const maxOrder = usingSamples ? 0 : products.reduce((m, p) => Math.max(m, p.order), 0);
    const body = {
      ...form,
      priceYen: Number(form.priceYen),
      stock: Number(form.stock),
      imageUrl: form.imageUrl || null,
      artistId: form.artistId || null,
      categoryId: form.categoryId || null,
      order: editing && !usingSamples ? editing.order : maxOrder + 1,
    };
    const res = await fetch('/admin/api/shop/products', {
      method: editing && !usingSamples ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing && !usingSamples ? { id: editing.id, ...body } : body),
    });
    if (res.ok) { setOpen(false); load(); } else { setSaveError((await res.json().catch(() => ({}))).error ?? '保存に失敗しました'); }
    setSaving(false);
  }

  // 「＋ 新しく作成」: 選択肢にない作家・カテゴリをその場で作成して選択する
  async function createTax(kind: TaxonomyKind) {
    const name = prompt(kind === 'artists' ? '作家名を入力してください' : 'カテゴリ名を入力してください');
    if (!name || !name.trim()) return;
    const res = await fetch('/admin/api/shop/taxonomy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, name }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error ?? '作成に失敗しました'); return; }
    await loadTax();
    setForm((f) => ({ ...f, [kind === 'artists' ? 'artistId' : 'categoryId']: data.id }));
  }

  async function remove(p: AdminProduct) {
    if (!confirm(`「${p.name}」を削除します。よろしいですか？`)) return;
    const res = await fetch(`/admin/api/shop/products?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
    if (res.ok) load(); else alert((await res.json().catch(() => ({}))).error ?? '削除に失敗しました');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">ショップ商品管理</h2>
            <p className="text-xs text-gray-500 mt-1">{products.length} 件 · 価格は税込（円）</p>
          </div>
          <button onClick={openNew} className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">＋ 新規追加</button>
        </div>

        {usingSamples && (
          <div className="mb-6 bg-amber-950/50 border border-amber-800 text-amber-200 text-xs px-4 py-3 rounded-lg leading-relaxed">
            Firestore に商品が未登録のため、表示確認用のサンプル商品を表示しています（サンプルは編集・削除できません）。「＋ 新規追加」で最初の商品を登録すると、サンプルは表示されなくなります。
          </div>
        )}
        {loadError && <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg break-all">{loadError}</div>}

        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4 p-3">
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{p.name}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">{[p.artistName, p.categoryName].filter(Boolean).join(' · ') || '作家・カテゴリ未設定'}</p>
                  <p className="text-gray-400 text-xs mt-0.5">¥{p.priceYen.toLocaleString('ja-JP')} · 在庫 {p.stock}</p>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 ${STATUS_CLS[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                {!usingSamples && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(p)} className="text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg">編集</button>
                    <button onClick={() => remove(p)} className="text-xs text-red-400 hover:text-red-300 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg">削除</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto p-4" onClick={() => setOpen(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg my-8 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">{editing && !usingSamples ? '商品を編集' : '商品を追加'}</h3>
            <div><label className="block text-xs text-gray-400 mb-1.5">商品名</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">商品説明</label><textarea rows={4} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              {([['artists', '作家', 'artistId', tax.artists], ['categories', 'カテゴリ', 'categoryId', tax.categories]] as const).map(([kind, label, key, list]) => (
                <div key={kind}>
                  <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                  <select className={inputCls} value={form[key]} onChange={(e) => (e.target.value === '__new' ? createTax(kind) : setForm({ ...form, [key]: e.target.value }))}>
                    <option value="">未設定</option>
                    {list.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    <option value="__new">＋ 新しく作成…</option>
                  </select>
                </div>
              ))}
            </div>
            <ImageUploadField label="商品画像" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="shop" previewSize="md" />
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1.5">販売価格（税込・円）</label><input inputMode="numeric" className={inputCls} value={form.priceYen} onChange={(e) => setForm({ ...form, priceYen: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1.5">在庫数</label><input inputMode="numeric" className={inputCls} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">販売状態</label>
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}>
                {(Object.keys(STATUS_LABEL) as ProductStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            {saveError && <p className="text-xs text-red-400">{saveError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setOpen(false)} className="text-sm text-gray-400 hover:text-white px-4 py-2">キャンセル</button>
              <button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg">{saving ? '保存中...' : '保存'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
