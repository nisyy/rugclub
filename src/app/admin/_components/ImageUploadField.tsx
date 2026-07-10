'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/uploadImage';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'menu' | 'news' | 'gallery' | 'home-menu';
  previewSize?: 'sm' | 'md';
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'menu',
  previewSize = 'sm',
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const previewCls =
    previewSize === 'sm'
      ? 'h-20 w-20'
      : 'h-28 w-28';

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（10MB 上限）
    if (file.size > 10 * 1024 * 1024) {
      setError('ファイルサイズは 10MB 以下にしてください。');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, folder, (p) => setProgress(p));
      onChange(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (err as any)?.code ?? '';
      console.error('[ImageUpload] error code:', code);
      console.error('[ImageUpload] error message:', msg);
      console.error('[ImageUpload] full error:', err);
      setError(`アップロード失敗: ${code ? `[${code}] ` : ''}${msg}`);
    } finally {
      setUploading(false);
      setProgress(0);
      // input をリセット（同ファイル再選択を可能に）
      e.target.value = '';
    }
  }

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">{label}</label>

      {/* URL 直打ち + ファイル選択ボタン */}
      <div className="flex gap-2">
        <input
          type="url"
          className={inputCls + ' flex-1'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />

        {/* ファイル選択ラベル */}
        <label
          className={`shrink-0 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            uploading
              ? 'bg-gray-700/50 text-gray-600 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          {/* Upload icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {uploading ? `${progress}%` : 'UP'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
      </div>

      {/* プログレスバー */}
      {uploading && (
        <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <p className="mt-1.5 text-[11px] text-red-400">{error}</p>
      )}

      {/* プレビュー */}
      {value && !uploading && (
        <div className="mt-2 relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className={`${previewCls} object-cover rounded-lg border border-gray-700`}
          />
          {/* 削除ボタン */}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] leading-none transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition';
