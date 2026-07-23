'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pluginsRegistered = false;
function ensureGsapPlugins() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }
}

// ブラシで塗ったような不規則な境界線（11点、y=0〜100%）
// jitter は各点の右端到達位置のブレ幅（brush stroke の質感を出す）
const POINTS_Y = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const END_JITTER = [96, 104, 99, 108, 94, 105, 110, 97, 103, 95, 100];
const HIDDEN_X = -8;

function buildPolygon(xValues: number[]): string {
  const edge = POINTS_Y.map((y, i) => `${xValues[i]}% ${y}%`).join(', ');
  return `polygon(0% 0%, ${edge}, 0% 100%)`;
}

const HIDDEN_CLIP = buildPolygon(POINTS_Y.map(() => HIDDEN_X));
const REVEALED_CLIP = buildPolygon(END_JITTER);

interface BrushRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}

// スクロールで画面内に入ると、ブラシでなぞったような不規則な境界線が
// 左から右へ広がり写真が現れる演出
export default function BrushRevealImage({
  src,
  alt,
  className = '',
  imgClassName = 'object-cover',
  sizes,
  priority,
}: BrushRevealImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const el = wrapRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          clipPath: REVEALED_CLIP,
          duration: 1.4,
          ease: 'power2.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapRef} className={className} style={{ clipPath: HIDDEN_CLIP }}>
      <Image src={src} alt={alt} fill sizes={sizes} className={imgClassName} priority={priority} />
    </div>
  );
}
