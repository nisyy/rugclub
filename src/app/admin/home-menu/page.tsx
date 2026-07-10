'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../_components/AdminHeader';
import ImageUploadField from '../_components/ImageUploadField';
import type { AdminHomeSlide } from '@/types/admin';

export default function AdminHomeMenuPage() {
  const [items, setItems] = useState<AdminHomeSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminHomeSlide | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [reordering, setReordering] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/admin/api/home-menu');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openNew() {
    setEditing(null);
    setImageUrl('');
    setSaveError('');
    setModalOpen(true);
  }

  function openEdit(item: AdminHomeSlide) {
    setEditing(item);
    setImageUrl(item.imageUrl);
    setSaveError('');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!imageUrl) { setSaveError('画像を選択してください'); return; }
    setSaving(true);
    setSaveError('');
    const method = editing ? 'PUT' : 'POST';
    const body = editing
      ? { id: editing.id, imageUrl, order: editing.order }
      : { imageUrl, order: items.length + 1 };
    const res = await fetch('/admin/api/home-menu', {
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
    const res = await fetch(`/admin/api/home-menu?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error ?? '削除に失敗しました');
    } else {
      fetchItems();
    }
    setDeleteId(null);
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    setReordering(true);
    const newItems = [...items];
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    // 楽観的更新
    setItems(newItems.map((item, i) => ({ ...item, order: i + 1 })));

    // Notionに順番を保存
    await Promise.all([
      fetch('/admin/api/home-menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newItems[index].id, order: index + 1 }),
      }),
      fetch('/admin/api/home-menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newItems[targetIndex].id, order: targetIndex + 1 }),
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
            <h2 className="text-xl font-bold text-white">TOPメニュー画像管理</h2>
            <p className="text-xs text-gray-500 mt-1">{items.length} 件 · 上下ボタンで順番を変更できます</p>
          </div>
          <button
            onClick={openNew}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            ＋ 画像を追加
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
          <div className="text-center py-20 text-gray-600 text-sm">画像がありません。「＋ 画像を追加」から登録してください。</div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4 p-3">
                {/* サムネイル */}
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={`TOP画像 ${i + 1}`} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* 順番 */}
                <div className="text-gray-400 text-sm font-semibold w-8 text-center shrink-0">
                  {i + 1}
                </div>

                {/* 並び替えボタン */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(i, 'up')}
                    disabled={i === 0 || reordering}
                    className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded text-white text-xs transition-colors"
                    aria-label="上へ"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMove(i, 'down')}
                    disabled={i === items.length - 1 || reordering}
                    className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded text-white text-xs transition-colors"
                    aria-label="下へ"
                  >
                    ▼
                  </button>
                </div>

                {/* 操作ボタン */}
                <div className="ml-auto flex gap-3 shrink-0">
                  <button onClick={() => openEdit(item)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    画像変更
                  </button>
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
        )}
      </main>

      {/* モーダル */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setModalOpen(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-6">
              {editing ? '画像を変更' : '画像を追加'}
            </h3>

            <ImageUploadField
              label="TOP画像 *"
              value={imageUrl}
              onChange={setImageUrl}
              folder="home-menu"
              previewSize="md"
            />

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
                disabled={saving || !imageUrl}
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
