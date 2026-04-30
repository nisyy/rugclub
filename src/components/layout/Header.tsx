'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { label: 'ABOUT', sub: 'RUG CLUBについて', href: '/about' },
  { label: 'FOOD', sub: 'フード・ドリンク', href: '/menu' },
  { label: 'GALLERY', sub: 'ギャラリー', href: '/gallery' },
  { label: 'RENTAL SPACE', sub: 'レンタルスペース', href: '/space-rental' },
  { label: 'ACCESS',       sub: 'アクセス',            href: '/access' },
  { label: 'NEWS',         sub: 'お知らせ',            href: '/news' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuShow, setMenuShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 定数
  const RADIUS = 32;          // 逆角丸の半径 (2rem相当)
  const LOGO_BOX_W = 144;     // ロゴエリアの幅
  const LOGO_BOX_H = 108;     // ロゴエリアの高さ
  const OFFSET = 12;          // inset-3 (12px)

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
          {/* ① ベース背景（全体クリーム色） */}
          <div className="fixed inset-0 z-[60] bg-cream" style={{ opacity: menuShow ? 1 : 0, transition: 'opacity 0.35s' }} />

          {/* ② メインのオレンジパネル（左上の角を直角にして隙間を消す） */}
          <div
            className="fixed inset-3 z-[61] bg-orange rounded-[2rem] rounded-tl-none overflow-hidden"
            style={{
              opacity: menuShow ? 1 : 0,
              transform: menuShow ? 'scale(1)' : 'scale(0.98)',
              transition: 'opacity 0.35s, transform 0.35s ease-out',
            }}
          >
            {/* 
              魔法の「逆角丸」パーツ：
              土台をクリーム色にし、その上にオレンジを載せて特定の角を丸めることで
              メインのオレンジパネルが内側に凹んでいるように錯覚させます。
            */}
            
            {/* 【修正】右横の接続部：ロゴの右端上部 */}
            <div 
              className="absolute bg-cream" 
              style={{ 
                top: 0, 
                left: LOGO_BOX_W - OFFSET, 
                width: RADIUS, 
                height: RADIUS 
              }}
            >
              {/* 角を左上(tl)に設定して、オレンジの板を回転させる */}
              <div className="w-full h-full bg-orange rounded-tl-[2rem]" />
            </div>

            {/* 【修正】下側の接続部：ロゴの左端下部 */}
            <div 
              className="absolute bg-cream" 
              style={{ 
                top: LOGO_BOX_H - OFFSET, 
                left: 0, 
                width: RADIUS, 
                height: RADIUS 
              }}
            >
              {/* 角を左上(tl)に設定して、オレンジの板を回転させる */}
              <div className="w-full h-full bg-orange rounded-tl-[2rem]" />
            </div>

            <div className="h-full overflow-y-auto px-8 pt-36 pb-10 relative z-10">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className="group">
                    <p className="font-display text-cream text-4xl group-hover:opacity-70 transition-opacity uppercase tracking-tight">{link.label}</p>
                    <p className="text-cream/60 text-xs mt-1">{link.sub}</p>
                  </Link>
                ))}
              </nav>
            </div>
            <button onClick={closeMenu} className="absolute top-4 right-4 w-12 h-12 bg-navy text-cream rounded-full flex items-center justify-center font-bold z-20">✕</button>
          </div>

          {/* ③ ロゴエリア（一番上に置くクリームの土台） */}
          <div
            className="fixed top-0 left-0 z-[65] bg-cream rounded-br-[2rem] p-3 pt-4 pl-4"
            style={{ 
              width: LOGO_BOX_W, 
              height: LOGO_BOX_H,
              opacity: menuShow ? 1 : 0, 
              transition: 'opacity 0.35s' 
            }}
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