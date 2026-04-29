'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// ナビリンク（英語ラベル + 日本語サブタイトル）
const navLinks = [
  { label: 'HOME',         sub: 'ホーム',              href: '/' },
  { label: 'ABOUT',        sub: 'RUG CLUBについて',    href: '/about' },
  { label: 'FOOD',         sub: 'フード・ドリンク',     href: '/menu' },
  { label: 'GALLERY',      sub: 'ギャラリー',          href: '/gallery' },
  { label: 'RENTAL SPACE', sub: 'レンタルスペース',     href: '/space-rental' },
  { label: 'ACCESS',       sub: 'アクセス',            href: '/access' },
  { label: 'NEWS',         sub: 'お知らせ',            href: '/news' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── 固定ヘッダーバー ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-display text-navy text-xl font-bold tracking-wider">
              RUG<span className="text-orange"> CLUB</span>
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              aria-label="メニューを開く"
              aria-expanded={isOpen}
              className="font-display text-navy text-sm tracking-[0.25em] border-b-2 border-navy pb-0.5 hover:opacity-70 transition-opacity"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* ── フルスクリーン オーバーレイ ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className={`fixed inset-0 z-[60] bg-orange overflow-y-auto
          transition-opacity duration-400 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="min-h-full px-6 pt-8 pb-10 flex flex-col">

          {/* 閉じるボタン（黒丸×） */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="メニューを閉じる"
              className="w-10 h-10 rounded-full bg-navy text-cream flex items-center justify-center
                text-base font-bold hover:opacity-80 transition-opacity duration-200 shrink-0"
            >
              ✕
            </button>
          </div>

          {/* ── ナビゲーション ── */}
          <nav className="flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block group mb-4"
              >
                <p className="font-display text-cream text-4xl sm:text-5xl leading-none
                  group-hover:opacity-70 transition-opacity duration-200">
                  {link.label}
                </p>
                <p className="text-cream/70 text-xs mt-1">
                  {link.sub}
                </p>
              </Link>
            ))}
          </nav>

          {/* ── 点線区切り ── */}
          <hr className="border-dashed border-cream/30 my-6" />

          {/* ── お問い合わせボタン ── */}
          <div className="flex justify-center mb-6">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="font-display text-cream text-sm tracking-[0.2em] uppercase
                bg-navy rounded-full px-12 py-3
                hover:opacity-80 transition-opacity duration-200"
            >
              お問い合わせ
            </Link>
          </div>

          {/* ── 点線区切り ── */}
          <hr className="border-dashed border-cream/30 mb-6" />

          {/* ── FOLLOW US ── */}
          <div className="flex flex-col items-center gap-4">
            <p className="font-display text-cream text-xs tracking-[0.3em] uppercase">
              Follow Us
            </p>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/rug___club?igsh=b2oyNTY4bzBjeGR0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center
                  hover:opacity-80 transition-opacity duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                  viewBox="0 0 24 24" fill="none" stroke="#C4531A"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center
                  hover:opacity-80 transition-opacity duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="#C4531A">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
