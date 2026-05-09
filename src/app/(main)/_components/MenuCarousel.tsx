'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// public/menu/ に配置した jpg
const SLIDES = [
  '/menu/menu_1.jpg',
  '/menu/menu_2.jpg',
  '/menu/menu_3.jpg',
  '/menu/menu_4.jpg',
];

/** カード i が current から何枚ずれているか（-n/2 < offset <= n/2） */
function getOffset(i: number, current: number, n: number): number {
  let d = i - current;
  if (d >  n / 2) d -= n;
  if (d <= -(n / 2)) d += n;
  return d;
}

const CARD_W   = 150;  // カード幅 px（高さ:幅 = 3:1 → 高さ = 450px）
const SLIDE_GAP = 165; // カード中心間の距離 px

export default function MenuCarousel() {
  const [active, setActive]   = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const n = SLIDES.length;

  // 自動スクロール（5秒間隔）
  const next = useCallback(() => setActive((p) => (p + 1) % n), [n]);
  const prev = useCallback(() => setActive((p) => (p - 1 + n) % n), [n]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  // カードタップ: サイド → センターへ移動 / センター → ライトボックス
  function handleCardClick(i: number) {
    if (getOffset(i, active, n) === 0) {
      setLightbox(SLIDES[i]);
    } else {
      setActive(i);
    }
  }

  // スワイプ対応
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
  }

  return (
    <>
      {/* カルーセル本体 */}
      <div
        className="relative h-[470px] sm:h-[520px] overflow-hidden select-none mb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((src, i) => {
          const offset   = getOffset(i, active, n);
          const isCenter = offset === 0;
          const isAdj    = Math.abs(offset) === 1;
          const visible  = isCenter || isAdj;

          return (
            <button
              key={i}
              onClick={() => handleCardClick(i)}
              aria-label={`メニュー画像 ${i + 1}`}
              className="absolute top-1/2 left-1/2 focus:outline-none"
              style={{
                width: `${CARD_W}px`,
                /* 高さ:幅 = 3:1 → aspect-ratio: 1/3 */
                transform: `translateX(calc(-50% + ${offset * SLIDE_GAP}px)) translateY(-50%) scale(${isCenter ? 1 : 0.78})`,
                opacity:   visible ? (isCenter ? 1 : 0.5) : 0,
                transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease',
                zIndex:    isCenter ? 10 : 5,
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              {/* aspect-[1/3] = width:height = 1:3 → 高さが幅の3倍 */}
              <div className="overflow-hidden rounded-2xl shadow-xl aspect-[1/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </button>
          );
        })}

        {/* ドットインジケーター */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`スライド ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-5 bg-navy' : 'w-1.5 bg-navy/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ライトボックス（センターカードタップで全画面表示） */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            className="max-h-full max-w-full object-contain rounded-xl"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
