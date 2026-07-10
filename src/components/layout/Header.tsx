'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { label: 'ABOUT', sub: 'RUG CLUBについて', href: '/about' },
  { label: 'GALLERY', sub: 'ギャラリー', href: '/gallery' },
  // { label: 'RENTAL SPACE', sub: 'レンタルスペース', href: '/space-rental' }, // 準備中
  { label: 'ACCESS', sub: 'アクセス', href: '/access' },
  { label: 'NEWS', sub: 'お知らせ', href: '/news' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuShow, setMenuShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 定数
  const RADIUS = 32;
  const LOGO_BOX_W = 144;
  const LOGO_BOX_H = 108;
  const OFFSET = 12;

  function openMenu() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMenuOpen(true);
    timerRef.current = setTimeout(() => setMenuShow(true), 10);
  }

  function closeMenu() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMenuShow(false);
    timerRef.current = setTimeout(() => setMenuOpen(false), 380);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-transparent h-16 flex items-center justify-between px-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/RUG_CLUB_logo2.png" alt="Logo" width={120} height={80} className="object-contain" />
        </Link>
        <button onClick={openMenu} className="flex flex-col gap-[5px] w-8">
          <span className="block h-[2px] w-full bg-navy rounded-full" />
          <span className="block h-[2px] w-full bg-navy rounded-full" />
          <span className="block h-[2px] w-5 bg-navy rounded-full" />
        </button>
      </header>

      {menuOpen && (
        <>
          {/* ① 全画面背景 */}
          <div className="fixed inset-0 z-[60] bg-cream" style={{ opacity: menuShow ? 1 : 0, transition: 'opacity 0.35s' }} />

          {/* ② メインパネル */}
          <div
            className="fixed inset-3 z-[61] bg-orange rounded-[2rem] rounded-tl-none overflow-hidden"
            style={{
              opacity: menuShow ? 1 : 0,
              transform: menuShow ? 'scale(1)' : 'scale(0.98)',
              transition: 'opacity 0.35s, transform 0.35s ease-out',
            }}
          >
            {/* 逆角丸パーツ */}
            <div className="absolute bg-cream" style={{ top: 0, left: LOGO_BOX_W - OFFSET, width: RADIUS, height: RADIUS }}>
              <div className="w-full h-full bg-orange rounded-tl-[2rem]" />
            </div>
            <div className="absolute bg-cream" style={{ top: LOGO_BOX_H - OFFSET, left: 0, width: RADIUS, height: RADIUS }}>
              <div className="w-full h-full bg-orange rounded-tl-[2rem]" />
            </div>

            {/* スクロールコンテンツ */}
            <div className="h-full overflow-y-auto pr-6 pl-[30px] pt-36 pb-10 flex flex-col">
              {/* ナビゲーション */}
              <nav className="flex flex-col gap-6 mb-12">
                {/* ABOUT */}
                <Link href="/about" onClick={closeMenu} className="group">
                  <p className="font-display text-cream text-4xl group-hover:opacity-70 transition-opacity uppercase tracking-tight">ABOUT</p>
                  <p className="text-cream/60 text-xs mt-1">RUG CLUBについて</p>
                </Link>

                {/* MENU */}
                <Link href="/menu" onClick={closeMenu} className="group">
                  <p className="font-display text-cream text-4xl group-hover:opacity-70 transition-opacity uppercase tracking-tight">MENU</p>
                  <p className="text-cream/60 text-xs mt-1">フード・ドリンク</p>
                </Link>

                {/* その他のリンク（ABOUT を除く） */}
                {navLinks.filter((l) => l.href !== '/about').map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className="group">
                    <p className="font-display text-cream text-4xl group-hover:opacity-70 transition-opacity uppercase tracking-tight">
                      {link.label}
                    </p>
                    <p className="text-cream/60 text-xs mt-1">{link.sub}</p>
                  </Link>
                ))}
              </nav>

              <hr className="border-dashed border-cream/30 mb-8" />

              {/* お問い合わせ */}
              <div className="flex justify-center mb-8">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="font-display text-cream text-sm tracking-[0.2em] uppercase bg-navy rounded-full px-12 py-3 hover:opacity-80 transition-opacity duration-200"
                >
                  お問い合わせ
                </Link>
              </div>

              <hr className="border-dashed border-cream/30 mb-8" />

              {/* Follow Us アイコンセクション */}
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
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                      viewBox="0 0 24 24" fill="none" stroke="orange"
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
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 24 24" fill="orange">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <button onClick={closeMenu} className="absolute top-4 right-4 w-12 h-12 bg-navy text-cream rounded-full flex items-center justify-center font-bold z-20">✕</button>
          </div>

          {/* ③ ロゴエリア */}
          <div
            className="fixed top-0 left-0 z-[65] bg-cream rounded-br-[2rem] p-3 pt-4 pl-4"
            style={{ width: LOGO_BOX_W, height: LOGO_BOX_H, opacity: menuShow ? 1 : 0, transition: 'opacity 0.35s' }}
          >
            <Link href="/" onClick={closeMenu}>
              <Image src="/RUG_CLUB_log.png" alt="RUG CLUB" width={120} height={84} className="object-contain" priority />
            </Link>
          </div>
        </>
      )}
    </>
  );
}