'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const INTERVAL = 4000;

// 商品画像ギャラリー。左右ボタン・ドット・スワイプ操作に対応し、2枚以上の時は自動でスライドする。
// ホバー/フォーカス中は一時停止し、「視差効果を減らす」設定の端末では自動再生しない。
export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = images.length;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (n < 2 || paused || reduced) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % n), INTERVAL);
    return () => clearInterval(t);
  }, [n, paused, reduced, current]);

  const go = (i: number) => setCurrent((i + n) % n);

  if (n === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-md bg-navy/5">
        <div className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.3em] text-navy/30 font-display uppercase">No Image</div>
      </div>
    );
  }

  const arrow = 'absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 text-navy shadow-md flex items-center justify-center hover:bg-white transition-colors';

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt}の画像`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative aspect-square overflow-hidden rounded-md bg-navy/5"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) go(current + (d > 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {images.map((src, i) => (
          <div key={src + i} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`} aria-hidden={i !== current}>
            <Image src={src} alt={`${alt}（${i + 1}/${n}）`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority={i === 0} />
          </div>
        ))}
        {n > 1 && (
          <>
            <button type="button" aria-label="前の画像" onClick={() => go(current - 1)} className={`${arrow} left-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button type="button" aria-label="次の画像" onClick={() => go(current + 1)} className={`${arrow} right-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button key={i} type="button" aria-label={`${i + 1}枚目を表示`} aria-current={i === current} onClick={() => go(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-navy' : 'w-2 bg-navy/25 hover:bg-navy/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
