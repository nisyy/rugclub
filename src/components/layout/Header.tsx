'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { label: 'ABOUT', sub: 'RUG CLUBについて', href: '/about' },
  { label: 'FOOD', sub: 'フード・ドリンク', href: '/menu' },
  { label: 'GALLERY', sub: 'ギャラリー', href: '/gallery' },
  { label: 'RENTAL SPACE', sub: 'レンタルスペース', href: '/space-rental' },
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
          <div className="fixed inset-0 z-[60] bg-cream" style={{ opacity: menuShow ? 1 : 0, transition: 'opacity 0.35s' }} />

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
            {/* pl-[27px] (20pt) を指定してテキストの開始位置を調整 */}
            <div className="h-full overflow-y-auto pr-6 pl-[30px] pt-36 pb-10 flex flex-col">
              <nav className="flex flex-col gap-6 mb-12">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className="group">
                    <p className="font-display text-cream text-4xl group-hover:opacity-70 transition-opacity uppercase tracking-tight">
                      {link.label}
                    </p>
                    <p className="text-cream/60 text-xs mt-1">{link.sub}</p>
                  </Link>
                ))}
              </nav>

              <hr className="border-dashed border-cream/30 mb-8" />

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

              <div className="flex flex-col items-center gap-4">
                <p className="font-display text-cream text-xs tracking-[0.3em] uppercase">Follow Us</p>
                <div className="flex items-center gap-4">
                  {/* Instagram/X SVGは前述のコードと同様 */}
                </div>
              </div>
            </div>

            <button onClick={closeMenu} className="absolute top-4 right-4 w-12 h-12 bg-navy text-cream rounded-full flex items-center justify-center font-bold z-20">✕</button>
          </div>

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