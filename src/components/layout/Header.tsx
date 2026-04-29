'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

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

// アニメーションの状態遷移
// closed → opening(円拡大 0.55s) → open(内容フェードイン) →
// closing-content(内容フェードアウト 0.25s) → closing-circle(円縮小 0.55s) → closed
type MenuState = 'closed' | 'opening' | 'open' | 'closing-content' | 'closing-circle';

// 拡張サークルの初期直径 (px) — MENUボタン付近に配置
const CIRCLE_SIZE = 48;

export default function Header() {
  const [menuState, setMenuState] = useState<MenuState>('closed');
  // 全画面を覆うのに必要なスケール値（openMenu時に計算）
  const [expandScale, setExpandScale] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  // ボタン中心から最も遠い角までの距離 ÷ 半径
  function calcScale(): number {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const r = CIRCLE_SIZE / 2;
    // ボタン中心のおおよその座標（header h-16=64px、right px-6=24px）
    const bx = w - 24 - r;
    const by = (64 - CIRCLE_SIZE) / 2 + r; // = 32
    const maxDist = Math.max(
      Math.hypot(bx, by),              // 左上角
      Math.hypot(bx, h - by),          // 左下角
      Math.hypot(w - bx, h - by),      // 右下角
      Math.hypot(w - bx, by),          // 右上角
    );
    return Math.ceil(maxDist / r) + 3;
  }

  function openMenu() {
    clearTimers();
    setExpandScale(calcScale());
    setMenuState('opening');
    timersRef.current.push(
      setTimeout(() => setMenuState('open'), 550),
    );
  }

  function closeMenu() {
    clearTimers();
    setMenuState('closing-content');
    timersRef.current.push(
      setTimeout(() => setMenuState('closing-circle'), 250),
    );
    timersRef.current.push(
      setTimeout(() => setMenuState('closed'), 250 + 550),
    );
  }

  // body スクロールロック
  useEffect(() => {
    document.body.style.overflow = menuState !== 'closed' ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuState]);

  // クリーンアップ
  useEffect(() => () => clearTimers(), []);

  // ESCキー
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuState === 'open') closeMenu();
    }
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState]);

  // サークルが拡大している状態かどうか
  const circleExpanded =
    menuState === 'opening' ||
    menuState === 'open' ||
    menuState === 'closing-content';

  // メニュー内容が見える状態かどうか
  const contentVisible =
    menuState === 'open' || menuState === 'closing-content';

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
              onClick={openMenu}
              aria-label="メニューを開く"
              aria-expanded={menuState !== 'closed'}
              className="font-display text-navy text-sm tracking-[0.25em] border-b-2 border-navy pb-0.5 hover:opacity-70 transition-opacity"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* ── 拡張サークル（アニメーション専用・非インタラクティブ） ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: `${(64 - CIRCLE_SIZE) / 2}px`,
          right: '24px',
          width: `${CIRCLE_SIZE}px`,
          height: `${CIRCLE_SIZE}px`,
          borderRadius: '50%',
          backgroundColor: '#C4531A',
          zIndex: 55,
          transformOrigin: 'center',
          transform: `scale(${circleExpanded ? expandScale : 0})`,
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* ── メニューコンテンツ（サークルより前面） ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: `opacity ${contentVisible ? '0.3s' : '0.2s'} ease`,
          pointerEvents: contentVisible ? 'auto' : 'none',
        }}
        className="fixed inset-0 z-[60] bg-orange overflow-y-auto"
      >
        <div className="min-h-full px-6 pt-8 pb-10 flex flex-col">

          {/* 閉じるボタン（黒丸×） */}
          <div className="flex justify-end mb-4">
            <button
              onClick={closeMenu}
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
                onClick={closeMenu}
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
              onClick={closeMenu}
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
