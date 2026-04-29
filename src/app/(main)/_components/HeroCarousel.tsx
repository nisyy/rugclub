'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

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

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % photos.length),
    [],
  );

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

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

      {/* ドットインジケーター */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
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
