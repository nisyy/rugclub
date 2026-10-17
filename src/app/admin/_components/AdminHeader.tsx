'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

const navItems = [
  { label: 'ダッシュボード', href: '/admin' },
  { label: 'メニュー', href: '/admin/menu' },
  { label: 'ニュース', href: '/admin/news' },
  { label: 'ギャラリー', href: '/admin/gallery' },
  { label: 'ショップ商品', href: '/admin/shop' },
  { label: 'ショップ注文', href: '/admin/shop/orders' },
  { label: '作家・カテゴリ', href: '/admin/shop/taxonomy' },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* ロゴ */}
        <Link href="/admin" className="shrink-0">
          <span className="text-sm font-bold tracking-widest text-white">RUG CLUB</span>
          <span className="text-[10px] text-gray-500 tracking-[0.3em] uppercase ml-2">Admin</span>
        </Link>

        {/* ナビ */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : item.href === '/admin/shop'
                  ? pathname === '/admin/shop'
                  : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 右側 */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] text-gray-500 hover:text-white transition-colors hidden sm:block"
          >
            サイトを見る →
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
