'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartLine } from '@/lib/shop/types';

const STORAGE_KEY = 'rugclub_cart_v1';
const MAX_QTY = 99;

interface CartContextValue {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  add: (id: string, qty: number, maxQty: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (l): l is CartLine =>
        l && typeof l.id === 'string' && Number.isInteger(l.qty) && l.qty >= 1,
    );
  } catch {
    return [];
  }
}

// カートには商品IDと数量だけを保存する（価格・個人情報・決済情報は保存しない）
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // SSRとのHydration不一致を避けるため、マウント後にlocalStorageを読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const add = useCallback((id: string, qty: number, maxQty: number) => {
    setLines((prev) => {
      const limit = Math.min(maxQty, MAX_QTY);
      const cur = prev.find((l) => l.id === id)?.qty ?? 0;
      const next = Math.min(cur + Math.max(1, Math.floor(qty)), limit);
      return cur === 0
        ? [...prev, { id, qty: next }]
        : prev.map((l) => (l.id === id ? { id, qty: next } : l));
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const q = Math.min(Math.max(1, Math.floor(qty) || 1), MAX_QTY);
    setLines((prev) => prev.map((l) => (l.id === id ? { id, qty: q } : l)));
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      hydrated,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, hydrated, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
