'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/shop/CartProvider';
import QtyStepper from './QtyStepper';

export default function AddToCart({ productId, maxQty, purchasable }: { productId: string; maxQty: number; purchasable: boolean }) {
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.id === productId)?.qty ?? 0;

  if (!purchasable) {
    return <button disabled className="w-full max-w-xs bg-navy/20 text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full cursor-not-allowed">売り切れ</button>;
  }
  const remaining = Math.max(maxQty - inCart, 0);

  return (
    <div className="space-y-4">
      {remaining > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-xs text-navy/50">数量</span>
          <QtyStepper value={Math.min(qty, remaining)} max={remaining} onChange={setQty} />
        </div>
      )}
      <button
        type="button"
        disabled={remaining === 0}
        onClick={() => { add(productId, Math.min(qty, remaining), maxQty); setAdded(true); }}
        className="w-full max-w-xs bg-orange text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full hover:bg-orange-dark transition-colors disabled:bg-navy/20 disabled:cursor-not-allowed"
      >
        {remaining === 0 ? 'カートの数量が上限です' : 'カートに追加する'}
      </button>
      {(added || inCart > 0) && (
        <p className="text-xs text-navy/60">
          カートに{inCart}点入っています。 <Link href="/shop/cart" className="text-orange underline underline-offset-2">カートを見る</Link>
        </p>
      )}
    </div>
  );
}
