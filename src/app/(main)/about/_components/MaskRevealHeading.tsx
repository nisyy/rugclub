'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pluginsRegistered = false;
function ensureGsapPlugins() {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }
}

interface MaskRevealHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
}

// スクロールで画面内に入ったタイミングで、上から下へカーテンが開くように
// テキストが現れるマスクワイプ演出（clip-path アニメーション）
export default function MaskRevealHeading({
  children,
  className = '',
  as: Tag = 'h2',
  delay = 0,
}: MaskRevealHeadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const el = wrapRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1,
          delay: delay / 1000,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [delay]);

  return (
    <div ref={wrapRef} style={{ clipPath: 'inset(0% 0% 100% 0%)' }}>
      <Tag className={className}>{children}</Tag>
    </div>
  );
}
