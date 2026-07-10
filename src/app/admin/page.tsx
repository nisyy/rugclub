import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './_components/LogoutButton';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const expected = process.env.ADMIN_PASSWORD;
  if (!session || !expected || session.value !== expected) {
    redirect('/admin/login');
  }

  const cards = [
    {
      label: 'Menu',
      labelJa: 'メニュー管理',
      href: '/admin/menu',
      color: 'from-violet-600 to-indigo-600',
      icon: '🍽️',
    },
    {
      label: 'TOP Images',
      labelJa: 'TOPメニュー画像管理',
      href: '/admin/home-menu',
      color: 'from-sky-600 to-cyan-600',
      icon: '🖼️',
    },
    {
      label: 'News',
      labelJa: 'ニュース管理',
      href: '/admin/news',
      color: 'from-emerald-600 to-teal-600',
      icon: '📰',
    },
    {
      label: 'Gallery',
      labelJa: 'ギャラリー管理',
      href: '/admin/gallery',
      color: 'from-amber-600 to-orange-600',
      icon: '🖼️',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ヘッダー */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-widest">RUG CLUB</h1>
          <p className="text-[11px] text-gray-500 tracking-[0.3em] uppercase">Admin Panel</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            サイトを見る →
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* メイン */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white">ダッシュボード</h2>
          <p className="text-sm text-gray-500 mt-1">コンテンツの管理・編集を行います。</p>
        </div>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-200 p-6"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
              />
              <div className="relative">
                <span className="text-4xl mb-4 block">{card.icon}</span>
                <h3 className="text-xl font-bold text-white">{card.label}</h3>
                <p className="text-sm text-gray-400 mt-1">{card.labelJa}</p>
                <p className="text-[11px] text-gray-500 tracking-widest uppercase mt-4 group-hover:text-gray-300 transition-colors">
                  管理する →
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* フッターメモ */}
        <div className="mt-12 p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">はじめに</h3>
          <ul className="space-y-1.5 text-xs text-gray-500 leading-relaxed">
            <li>• Notionデータベースと連携してコンテンツを管理します。</li>
            <li>• 画像アップロードはFirebase Storageを使用します。</li>
            <li>• 削除したアイテムはNotionのアーカイブに移動します。</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

