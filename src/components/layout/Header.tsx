'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { label: 'ABOUT',        sub: 'RUG CLUBについて',    href: '/about' },
  { label: 'FOOD',         sub: 'フード・ドリンク',     href: '/menu' },
  { label: 'GALLERY',      sub: 'ギャラリー',          href: '/gallery' },
  { label: 'RENTAL SPACE', sub: 'レンタルスペース',     href: '/space-rental' },
  { label: 'ACCESS',       sub: 'アクセス',            href: '/access' },
  { label: 'NEWS',         sub: 'お知らせ',            href: '/news' },
];

export default function Header() {
  // menuOpen  : DOM に描画するか
  // menuShow  : CSS opacity を 1 にするか（CSS トランジションのトリガー）
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuShow, setMenuShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMenuOpen(true);
    // 1 フレーム後に opacity を 1 へ → CSS トランジション発火
    timerRef.current = setTimeout(() => setMenuShow(true), 10);
  }

  function closeMenu() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMenuShow(false);                                    // フェードアウト開始
    timerRef.current = setTimeout(() => setMenuOpen(false), 380); // アンマウント
  }

  // スクロールロック
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // クリーンアップ
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ESC キー
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuShow) closeMenu();
    }
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuShow]);

  return (
    <>
      {/* ── 固定ヘッダーバー ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/RUG_CLUB_logo2.png"
                alt="RUG CLUB ロゴ"
                width={120}
                height={80}
                className="object-contain"
              />
            </Link>
            <button
              onClick={openMenu}
              aria-label="メニューを開く"
              aria-expanded={menuOpen}
              className="flex flex-col justify-center gap-[5px] w-8 h-8 hover:opacity-70 transition-opacity"
            >
              <span className="block h-[2px] w-full bg-navy rounded-full" />
              <span className="block h-[2px] w-full bg-navy rounded-full" />
              <span className="block h-[2px] w-5 bg-navy rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          {/* ────────────────────────────────────────
              ロゴ（白背景・角丸・カード左上に固定追従）
              ──────────────────────────────────────── */}
          <div
            className="fixed top-3 left-3 z-[70] bg-cream rounded-2xl p-2 shadow-sm"
            style={{
              opacity: menuShow ? 1 : 0,
              transform: menuShow ? 'scale(1)' : 'scale(0.92)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            <Link href="/" onClick={closeMenu} className="block hover:opacity-80 transition-opacity">
              <Image
                src="/RUG_CLUB_log.png"
                alt="RUG CLUB"
                width={120}
                height={84}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* ────────────────────────────────────────
              オレンジ角丸カード
              overflow-hidden で角丸を常時維持
              ──────────────────────────────────────── */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="ナビゲーションメニュー"
            className="fixed inset-x-3 top-3 bottom-3 z-[65] bg-orange rounded-[2rem] overflow-hidden"
            style={{
              opacity: menuShow ? 1 : 0,
              transform: menuShow ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {/* ── スクロール可能な内側（rounded は親で管理） ── */}
            <div className="h-full overflow-y-auto">

              {/* Sticky Xボタン（スクロールしても右上に追従） */}
              <div className="sticky top-0 z-10 flex justify-end px-4 pt-4 pb-2">
                <button
                  onClick={closeMenu}
                  aria-label="メニューを閉じる"
                  className="w-12 h-12 rounded-full bg-navy text-cream flex items-center justify-center
                    text-base font-bold hover:opacity-80 transition-opacity shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* ── コンテンツ ── */}
              <div className="px-6 pt-2 pb-10 flex flex-col min-h-[calc(100%-4rem)]">

                {/* ロゴ分の上余白（左上の白ロゴとコンテンツが被らないように） */}
                <div className="h-14" />

                {/* ナビゲーション */}
                <nav className="flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="block group mb-5"
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

                {/* 点線 */}
                <hr className="border-dashed border-cream/30 my-6" />

                {/* お問い合わせ */}
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

                {/* 点線 */}
                <hr className="border-dashed border-cream/30 mb-6" />

                {/* Follow Us */}
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
                        viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)"
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
                        viewBox="0 0 24 24" fill="var(--color-orange)">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
