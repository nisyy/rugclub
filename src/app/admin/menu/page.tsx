'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminHeader from '../_components/AdminHeader';
import ImageUploadField from '../_components/ImageUploadField';
import type { AdminMenuItem } from '@/types/admin';

const CATEGORIES = ['サンドウィッチ', 'デザート', 'ドリンク', 'モーニング'] as const;

// 画像のみ必須（商品名・価格の入力欄を隠す）カテゴリ
const IMAGE_ONLY_CATEGORIES = ['ドリンク', 'モーニング'];

const EMPTY: Omit<AdminMenuItem, 'id' | 'order'> = {
  name: '',
  category: CATEGORIES[0],
  price: '',
  imageUrl: '',
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMenuItem | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [reordering, setReordering] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/admin/api/menu');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // カテゴリごとにグルーピング（順番昇順を保った状態で最初に出現した順にカテゴリを並べる）
  const categories = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, AdminMenuItem[]>();
    for (const item of items) {
      const cat = item.category || '未分類';
      if (!map.has(cat)) {
        map.set(cat, []);
        order.push(cat);
      }
      map.get(cat)!.push(item);
    }
    return order.map((cat) => ({ category: cat, items: map.get(cat)! }));
  }, [items]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setSaveError('');
    setModalOpen(true);
  }

  function openEdit(item: AdminMenuItem) {
    setEditing(item);
    setForm({ name: item.name, category: item.category, price: item.price, imageUrl: item.imageUrl });
    setSaveError('');
    setModalOpen(true);
  }

  const isImageOnly = IMAGE_ONLY_CATEGORIES.includes(form.category);

  async function handleSave() {
    if (!form.category || !form.imageUrl || (!isImageOnly && !form.name)) {
      setSaveError('カテゴリ・画像は必須です');
      return;
    }
    setSaving(true);
    setSaveError('');
    const method = editing ? 'PUT' : 'POST';
    const maxOrder = items.reduce((max, i) => Math.max(max, i.order), 0);
    const order = editing ? editing.order : maxOrder + 1;
    // 画像のみのカテゴリは商品名・価格を自動生成（Notionのタイトル列に必要なため）
    const data = isImageOnly
      ? { ...form, name: form.name || `${form.category}画像 ${order}`, price: '' }
      : form;
    const body = editing
      ? { id: editing.id, ...data, order }
      : { ...data, order };
    const res = await fetch('/admin/api/menu', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setModalOpen(false);
      fetchItems();
    } else {
      const data = await res.json().catch(() => ({}));
      setSaveError(data.error ?? '保存に失敗しました');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    setDeleteError('');
    const res = await fetch(`/admin/api/menu?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error ?? '削除に失敗しました');
    } else {
      fetchItems();
    }
    setDeleteId(null);
  }

  // カテゴリ内でのみ並び替え（他カテゴリの順番には影響しない）
  async function handleMove(categoryItems: AdminMenuItem[], index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoryItems.length) return;

    setReordering(true);
    const a = categoryItems[index];
    const b = categoryItems[targetIndex];

    setItems((prev) => prev.map((it) => {
      if (it.id === a.id) return { ...it, order: b.order };
      if (it.id === b.id) return { ...it, order: a.order };
      return it;
    }));

    await Promise.all([
      fetch('/admin/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, order: b.order }),
      }),
      fetch('/admin/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b.id, order: a.order }),
      }),
    ]);
    setReordering(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">メニュー管理</h2>
            <p className="text-xs text-gray-500 mt-1">{items.length} 件 · カテゴリ内で上下ボタンにより順番を変更できます</p>
          </div>
          <button
            onClick={openNew}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            ＋ 新規追加
          </button>
        </div>

        {deleteError && (
          <div className="mb-5 flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg">
            <span className="text-red-400 font-bold shrink-0">⚠</span>
            <span className="break-all">{deleteError}</span>
            <button onClick={() => setDeleteError('')} className="ml-auto text-red-500 hover:text-red-300 shrink-0">✕</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">メニューがありません。「＋ 新規追加」から登録してください。</div>
        ) : (
          <div className="space-y-8">
            {categories.map(({ category, items: categoryItems }) => (
              <div key={category}>
                <h3 className="text-sm font-bold text-amber-500 tracking-wide mb-3">{category}</h3>
                <div className="space-y-3">
                  {categoryItems.map((item, i) => (
                    <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4 p-3">
                      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{item.price}</p>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => handleMove(categoryItems, i, 'up')}
                          disabled={i === 0 || reordering}
                          className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded text-white text-xs transition-colors"
                          aria-label="上へ"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMove(categoryItems, i, 'down')}
                          disabled={i === categoryItems.length - 1 || reordering}
                          className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded text-white text-xs transition-colors"
                          aria-label="下へ"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex gap-3 shrink-0">
                        <button onClick={() => openEdit(item)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">編集</button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteId === item.id}
                          className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                        >
                          {deleteId === item.id ? '削除中' : '削除'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* モーダル */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setModalOpen(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-6">
              {editing ? 'メニューを編集' : 'メニューを追加'}
            </h3>

            <div className="space-y-4">
              <Field label="カテゴリ *">
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              {isImageOnly ? (
                <p className="text-xs text-gray-500">
                  このカテゴリは画像のみで登録できます（商品名・価格は不要です）。
                </p>
              ) : (
                <>
                  <Field label="商品名 *">
                    <input
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="BLTサンド"
                    />
                  </Field>
                  <Field label="価格">
                    <input
                      className={inputCls}
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="¥990"
                    />
                  </Field>
                </>
              )}

              <ImageUploadField
                label="画像 *"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                folder="menu"
                previewSize="sm"
              />
            </div>

            {saveError && (
              <div className="mt-5 flex items-start gap-2 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg">
                <span className="text-red-400 font-bold shrink-0">⚠</span>
                <span className="break-all">{saveError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="text-sm text-gray-400 hover:text-white px-4 py-2 transition-colors">
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.category || !form.imageUrl || (!isImageOnly && !form.name)}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition';
