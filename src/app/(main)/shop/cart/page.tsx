'use client';

import Link from 'next/link';
import { useCart } from '@/components/shop/CartProvider';
import { formatYen } from '@/lib/shop/format';
import ProductImage from '../_components/ProductImage';
import QtyStepper from '../_components/QtyStepper';
import ShopHeading from '../_components/ShopHeading';
import DevNotice from '../_components/DevNotice';
import { useServerCart } from '../_components/useServerCart';

export default function CartPage() {
  const { remove, setQty } = useCart();
  const { lines, hydrated, cart, messages, error } = useServerCart();

  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Shopping Cart" title="CART" bg="CART" />
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <DevNotice>{cart?.testMode ? 'テストモード中です。ご注文はテスト注文として扱われ、決済・発送は行われません。' : '現在ご注文・決済はできません（決済未接続）。'}</DevNotice>

        {messages.length > 0 && (
          <div role="alert" className="mb-6 rounded-lg border border-orange/40 bg-white px-4 py-3 text-xs text-orange space-y-1">
            {messages.map((m) => <p key={m}>{m}</p>)}
          </div>
        )}
        {error && <p className="mb-6 text-xs text-orange">カートの最新情報を取得できませんでした。時間をおいて再度お試しください。</p>}

        {!hydrated ? null : lines.length === 0 || !cart || cart.lines.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-navy/50">カートに商品がありません。</p>
            <Link href="/shop" className="btn-pill mt-8">SHOPへ</Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-navy/10 border-y border-navy/10">
              {cart.lines.map((l) => (
                <li key={l.id} className="flex gap-4 py-5">
                  <Link href={`/shop/${l.id}`} className="w-20 shrink-0">
                    <ProductImage src={l.imageUrl} alt={l.name} sizes="80px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${l.id}`} className="text-sm font-bold text-navy leading-snug hover:text-orange transition-colors line-clamp-2">{l.name}</Link>
                    <p className="mt-1 text-xs text-navy/50">{formatYen(l.unitPriceYen)}（税込）</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QtyStepper value={l.qty} max={l.maxQty} onChange={(n) => setQty(l.id, n)} />
                      <p className="text-sm text-navy tabular-nums">{formatYen(l.lineTotalYen)}</p>
                    </div>
                    <button type="button" onClick={() => remove(l.id)} className="mt-2 text-[11px] text-navy/40 hover:text-orange underline underline-offset-2">削除</button>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-navy/60">小計（税込）</dt><dd className="tabular-nums">{formatYen(cart.subtotalYen)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy/60">送料</dt><dd className="text-navy/50">{cart.shippingYen === null ? '購入手続きで確認（未確定）' : `${formatYen(cart.shippingYen)}${cart.shippingProvisional ? '（テスト用の仮送料）' : ''}${cart.remoteShippingYen !== null ? `　※北海道・沖縄は${formatYen(cart.remoteShippingYen)}` : ''}`}</dd></div>
            </dl>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Link href="/shop/checkout" className="w-full max-w-xs text-center bg-orange text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full hover:bg-orange-dark transition-colors">
                購入手続きへ →
              </Link>
              <Link href="/shop" className="text-[11px] font-bold tracking-[0.25em] text-navy/40 hover:text-navy uppercase transition-colors">買い物を続ける</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
