'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/admin/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Firebase にもサインイン（Storage アップロード権限取得）
        const data = await res.json();
        if (data.firebaseToken) {
          try {
            await signInWithCustomToken(auth, data.firebaseToken);
          } catch (e) {
            console.error('[login] Firebase サインイン失敗:', e);
          }
        }
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.status === 429 ? '試行回数が多すぎます。しばらく時間をおいてからお試しください。' : 'パスワードが正しくありません。');
      }
    } catch {
      setError('接続エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-widest text-white">RUG CLUB</h1>
          <p className="text-xs text-gray-500 tracking-[0.3em] uppercase mt-1">Admin Panel</p>
        </div>

        {/* フォームカード */}
        <div className="bg-gray-900 rounded-xl px-8 py-10 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">ログイン</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white text-sm font-semibold tracking-wide rounded-lg py-3 transition-colors duration-200"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-6">
          RUG CLUB CAFE © 2026
        </p>
      </div>
    </div>
  );
}
