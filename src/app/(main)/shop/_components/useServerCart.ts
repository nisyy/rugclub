'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/shop/CartProvider';
import type { CartIssue, PricedCart } from '@/lib/shop/types';

function issueMessage(i: CartIssue): string {
  switch (i.kind) {
    case 'not_found': return '販売終了などの理由で、カートから削除された商品があります。';
    case 'sold_out': return `「${i.name}」は売り切れのため、カートから削除しました。`;
    case 'qty_adjusted': return `「${i.name}」は在庫の都合で数量を${i.qty}点に変更しました。`;
  }
}

// カートの内容をサーバーで再計算した結果を返す。差異（売り切れ・在庫超過）はローカルカートへ反映する。
export function useServerCart(prefecture?: string) {
  const { lines, hydrated, remove, setQty } = useCart();
  const [cart, setCart] = useState<PricedCart | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (lines.length === 0) { setCart(null); return; }
    let cancelled = false;
    setFetching(true);
    // 数量を連続で変えた時に通信を繰り返さないよう、少し待ってからまとめて確認する（初回は待たない）
    const timer = setTimeout(() => {
    (async () => {
      try {
        const res = await fetch('/api/shop/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines, prefecture }),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { cart: PricedCart };
        if (cancelled) return;
        setError(false);
        setCart(data.cart);
        if (data.cart.issues.length > 0) {
          setMessages((prev) => Array.from(new Set([...prev, ...data.cart.issues.map(issueMessage)])));
          for (const i of data.cart.issues) {
            if (i.kind === 'qty_adjusted') setQty(i.id, i.qty);
            else remove(i.id);
          }
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    }, cart ? 300 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [lines, hydrated, remove, setQty, prefecture]);

  // カートに商品があるのに、サーバーでの確認結果がまだ届いていない間は読み込み中
  const loading = !hydrated || (lines.length > 0 && cart === null && !error);
  return { lines, hydrated, cart, messages, error, loading, fetching };
}
