'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../_components/AdminHeader';
import ImageUploadField from '../_components/ImageUploadField';
import type { AdminGalleryItem } from '@/types/admin';

const EMPTY: Omit<AdminGalleryItem, 'id'> = {
  title: '',
  artist: '',
  imageUrl: '',
  status: 'available',
  instagramUrl: '',
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminGalleryItem | null>(null);
  const [form, setForm] = useState<Omit<AdminGalleryItem, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/admin/api/gallery');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setSaveError('');
    setModalOpen(true);
  }

  function openEdit(item: AdminGalleryItem) {
    setEditing(item);
    setForm({ title: item.title, artist: item.artist, imageUrl: item.imageUrl, status: item.status, instagramUrl: item.instagramUrl ?? '' });
    setSaveError('');
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;
    const res = await fetch('/admin/api/gallery', {
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
    const res = await fetch(`/admin/api/gallery?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error ?? '削除に失敗しました');
    } else {
      fetchItems();
    }
    setDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">ギャラリー管理</h2>
            <p className="text-xs text-gray-500 mt-1">{items.length} 件</p>
          </div>
          <button
            onClick={openNew}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            ＋ 新規追加
          </button>
        </div>

        {/* 削除エラー */}
        {deleteError && (
          <div className="mb-5 flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-xs px-4 py-3 rounded-lg">
            <span className="text-red-400 font-bold shrink-0">⚠</span>
            <span className="break-all">{deleteError}</span>
            <button onClick={() => setDeleteError('')} className="ml-auto text-red-500 hover:text-red-300 shrink-0">✕</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">読み込み中...</div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold tracking-wide">作品名</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold tracking-wide hidden sm:table-cell">アーティスト</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold tracking-wide hidden md:table-cell">ステータス</th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-semibold tracking-wide w-24">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className={`${i < items.length - 1 ? 'border-b border-gray-800/60' : ''} hover:bg-gray-800/40 transition-colors`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded-md border border-gray-700 shrink-0" />
                        )}
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{item.artist}</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">編集</button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteId === item.id}
                          className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                        >
                          {deleteId === item.id ? '削除中' : '削除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-600 text-sm">データがありません</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* モーダル */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setModalOpen(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-6">
              {editing ? '作品を編集' : '作品を追加'}
            </h3>

            <div className="space-y-4">
              <Field label="作品名 *">
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Botanica No.3"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="アーティスト">
                  <input
                    className={inputCls}
                    value={form.artist}
                    onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                    placeholder="坂本 将"
                  />
                </Field>
                <Field label="ステータス">
                  <select
                    className={inputCls}
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AdminGalleryItem['status'] }))}
                  >
                    <option value="available">販売中</option>
                    <option value="sold">売約済</option>
                  </select>
                </Field>
              </div>

              <Field label="Instagram URL（任意）">
                <input
                  className={inputCls}
                  type="url"
                  value={form.instagramUrl ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
                  placeholder="https://www.instagram.com/username"
                />
              </Field>

              <ImageUploadField
                label="画像"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                folder="gallery"
                previewSize="md"
              />
            </div>

            {/* 保存エラー */}
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
                disabled={saving || !form.title}
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

function StatusBadge({ status }: { status: 'available' | 'sold' }) {
  return status === 'available' ? (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 font-semibold">販売中</span>
  ) : (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-900/40 text-red-400 font-semibold">売約済</span>
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
