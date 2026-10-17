'use client';

import { useEffect, useState } from 'react';

// ヘッダー（透明）の帯に、スクロール時だけ背景色をつける。
// 後ろをスクロールする商品やボタンがヘッダー部分に透けて見えるのを防ぐ。ヘッダー本体(z-50)より下、検索欄と同じ層。
export default function HeaderBackdrop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-16 bg-cream transition-opacity duration-200 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
