'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const photos = [
  { src: '/contact/exhibit-1.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-2.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-3.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-4.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-5.jpg', alt: 'ギャラリー展示風景' },
  { src: '/contact/exhibit-6.jpg', alt: 'ギャラリー展示風景' },
];

const INTERVAL = 3500;

// 出展案内用のスライドショー。操作ボタンは持たず、自動でクロスフェード切り替えのみ行う。
export default function ExhibitionSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % photos.length),
      INTERVAL,
    );
    return () => clearInterval(timer);
  }, []);

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
      <div className="absolute inset-0 flex items-end p-6 lg:p-10">
        <p className="font-display text-cream text-xl lg:text-3xl tracking-[0.2em] uppercase">
          Gallery Exhibition
        </p>
      </div>
    </div>
  );
}
