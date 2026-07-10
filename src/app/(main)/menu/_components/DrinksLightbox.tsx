'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AdminMenuItem } from '@/types/admin';

// ドリンク：画像2枚を横並びで表示（商品名・価格なし）。タップで拡大表示。
export default function DrinksLightbox({ items }: { items: AdminMenuItem[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 pt-2">
        {items.slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => setLightbox(item.imageUrl)}
            className="aspect-square overflow-hidden rounded-md bg-navy/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.name || 'ドリンク'} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      {lightbox && createPortal(
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
        </div>,
        document.body,
      )}
    </>
  );
}
