'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400',
    alt: 'RUG CLUB カフェ店内',
  },
  {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400',
    alt: 'スペシャルティコーヒー',
  },
  {
    src: 'https://images.unsplash.com/photo-1579703822948-63bbcd4e5a07?w=1400',
    alt: 'カフェラテ アート',
  },
  {
    src: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1400',
    alt: 'ギャラリースペース',
  },
];

const INTERVAL = 3000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  // タイマーをリセットして再起動
  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % photos.length),
      INTERVAL,
    );
  }, []);

  useEffect(() => {
    restartTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restartTimer]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    restartTimer();
  }, [restartTimer]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + photos.length) % photos.length);
  }, [current, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % photos.length);
  }, [current, goTo]);

  // タッチスワイプ
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* 画像レイヤー（クロスフェード） */}
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* タッチ操作エリア（画像全面） */}
      <div
        className="absolute inset-0 z-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {/* 左右矢印ボタン（PC） */}
      <button
        onClick={goPrev}
        aria-label="前の画像"
        className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm
          items-center justify-center transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="white"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="次の画像"
        className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm
          items-center justify-center transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="white"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ドットインジケーター */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`スライド ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-2 bg-cream'
                : 'w-2 h-2 bg-cream/40 hover:bg-cream/70'
            }`}
          />
        ))}
      </div>
    </>
  );
}
