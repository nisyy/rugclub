'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartIcon() {
  const { count, hydrated } = useCart();
  return (
    <Link href="/shop/cart" aria-label={`カート（${count}点）`} className="relative w-8 h-8 flex items-center justify-center text-navy hover:opacity-70 transition-opacity">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.76L20 8H6" />
      </svg>
      {hydrated && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
