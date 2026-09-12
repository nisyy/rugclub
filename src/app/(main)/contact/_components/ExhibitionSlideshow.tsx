'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

const photos = [
  { src: '/contact/exhibit-1.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-2.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-3.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-4.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-5.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-6.jpg', alt: 'ギャラリー展示風景' },
];

const INTERVAL = 3500;

function PrevIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5v15l13-7.5-13-7.5z" />
    </svg>
  );
}

// 出展案内用のスライドショー。自動でクロスフェード切り替えしつつ、
// 前へ／次へ／一時停止ボタンでユーザーも操作できる。
export default function ExhibitionSlideshow() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!playing) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % photos.length),
      INTERVAL,
    );
  }, [playing]);

  useEffect(() => {
    restartTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restartTimer]);

  const goTo = (index: number) => {
    setCurrent((index + photos.length) % photos.length);
  };

  return (
    <div className="relative w-full h-[42vh] min-h-[280px] max-h-[480px] overflow-hidden rounded-2xl">
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-navy/25" />
      <div className="absolute inset-0 flex items-end px-6 pt-6 pb-20 lg:px-10 lg:pt-10 lg:pb-24">
        <p className="font-display text-cream text-base lg:text-2xl tracking-[0.2em] uppercase">
          Gallery Exhibition
        </p>
      </div>

      {/* 操作ボタン（前へ・一時停止／再生・次へ） */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="前の画像"
          className="w-11 h-11 rounded-full bg-white text-navy flex items-center justify-center shadow-md hover:bg-cream transition-colors duration-200"
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'スライドを一時停止' : 'スライドを再生'}
          className="w-11 h-11 rounded-full bg-white text-navy flex items-center justify-center shadow-md hover:bg-cream transition-colors duration-200"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="次の画像"
          className="w-11 h-11 rounded-full bg-white text-navy flex items-center justify-center shadow-md hover:bg-cream transition-colors duration-200"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
}
