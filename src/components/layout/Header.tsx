'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'HOME',         href: '/' },
  { label: 'ABOUT',        href: '/about' },
  { label: 'FOOD',         href: '/menu' },
  { label: 'GALLERY',      href: '/gallery' },
  { label: 'SPACE RENTAL', href: '/space-rental' },
  { label: 'ACCESS',       href: '/access' },
  { label: 'NEWS',         href: '/news' },
  { label: 'CONTACT',      href: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── Fixed header bar ── */}
      {/* 常時オレンジ背景（dilly-dally スタイル） */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">

            {/* ロゴ */}
            <Link href="/" className="font-display text-navy text-xl font-bold tracking-wider leading-tight">
              RUG<span className="text-orange"> CLUB</span>
            </Link>

            {/* MENU ボタン（dilly-dally スタイル） */}
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

      {/* ── Fullscreen overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center
          bg-navy
          transition-opacity duration-500 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* 閉じるボタン */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="メニューを閉じる"
          className="absolute top-4 right-6 lg:right-10 w-10 h-10 flex items-center justify-center
            font-display text-cream text-3xl leading-none
            hover:text-orange transition-colors duration-200"
        >
          ×
        </button>

        {/* ナビゲーション */}
        <nav className="flex flex-col items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-display text-cream text-2xl sm:text-3xl tracking-[0.2em] uppercase
                py-3 hover:text-orange transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* SNS */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="eyebrow text-cream/50">Follow Us</p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/rug___club?igsh=b2oyNTY4bzBjeGR0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-cream hover:text-orange transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-cream hover:text-orange transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
