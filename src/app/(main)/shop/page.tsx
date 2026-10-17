import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, isPurchasable } from '@/lib/shop/products';
import { formatYen } from '@/lib/shop/pricing';
import ProductImage from './_components/ProductImage';
import ShopHeading from './_components/ShopHeading';
import DevNotice from './_components/DevNotice';

export const metadata: Metadata = {
  title: 'SHOP',
  description: 'RUG CLUBのオンラインショップ。グッズ・作品の一覧です。',
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Online Shop" title="SHOP" bg="SHOP" />
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <DevNotice>
          オンラインショップは準備中です。表示中の商品はサンプルで、現在ご注文・決済はできません。
        </DevNotice>
        {products.length === 0 ? (
          <p className="text-center py-20 text-sm text-navy/40">現在、販売中の商品はありません。</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/shop/${p.id}`} className="group block">
                  <div className="relative">
                    <ProductImage src={p.imageUrl} alt={p.name} sizes="(min-width: 640px) 33vw, 50vw" />
                    {!isPurchasable(p) && (
                      <span className="absolute top-2 left-2 bg-navy/80 text-white text-[10px] font-semibold tracking-widest px-2.5 py-1">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-bold text-navy leading-snug group-hover:text-orange transition-colors line-clamp-2">
                    {p.name}
                  </p>
                  <p className="mt-1 text-sm text-navy/70">{formatYen(p.priceYen)}<span className="text-[11px] text-navy/40 ml-1">（税込）</span></p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
