import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, getTaxonomies, isPurchasable } from '@/lib/shop/products';
import { formatYen } from '@/lib/shop/format';
import ProductImage from './_components/ProductImage';
import ShopHeading from './_components/ShopHeading';
import DevNotice from './_components/DevNotice';

export const metadata: Metadata = {
  title: 'SHOP',
  description: 'RUG CLUBのオンラインショップ。グッズ・作品の一覧です。',
};

export const revalidate = 30;

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`text-xs font-semibold tracking-wide px-4 py-2 rounded-full transition-colors ${active ? 'bg-navy text-cream' : 'bg-white text-navy border border-navy/20 hover:border-navy/50'}`}>
      {children}
    </Link>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; artist?: string }> }) {
  const { category, artist } = await searchParams;
  const [all, tax] = await Promise.all([getProducts(), getTaxonomies()]);
  const products = all.filter((p) => (!category || p.categoryId === category) && (!artist || p.artistId === artist));
  const usedArtists = tax.artists.filter((a) => all.some((p) => p.artistId === a.id));
  const usedCategories = tax.categories.filter((c) => all.some((p) => p.categoryId === c.id));
  const href = (c?: string, a?: string) => {
    const q = new URLSearchParams();
    if (c) q.set('category', c);
    if (a) q.set('artist', a);
    const qs = q.toString();
    return qs ? `/shop?${qs}` : '/shop';
  };
  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Online Shop" title="SHOP" bg="SHOP" />
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <DevNotice>
          オンラインショップは準備中です。表示中の商品はサンプルで、現在ご注文・決済はできません。
        </DevNotice>
        {(usedCategories.length > 0 || usedArtists.length > 0) && (
          <div className="mb-8 space-y-3">
            {usedCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] tracking-[0.2em] text-navy/40 w-16">CATEGORY</span>
                <Chip href={href(undefined, artist)} active={!category}>すべて</Chip>
                {usedCategories.map((c) => <Chip key={c.id} href={href(c.id, artist)} active={category === c.id}>{c.name}</Chip>)}
              </div>
            )}
            {usedArtists.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] tracking-[0.2em] text-navy/40 w-16">ARTIST</span>
                <Chip href={href(category, undefined)} active={!artist}>すべて</Chip>
                {usedArtists.map((a) => <Chip key={a.id} href={href(category, a.id)} active={artist === a.id}>{a.name}</Chip>)}
              </div>
            )}
          </div>
        )}
        {products.length === 0 ? (
          <p className="text-center py-20 text-sm text-navy/40">該当する商品はありません。</p>
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
                  {p.artistName && <p className="mt-3 text-[11px] tracking-wide text-navy/50">{p.artistName}</p>}
                  <p className={`${p.artistName ? 'mt-0.5' : 'mt-3'} text-sm font-bold text-navy leading-snug group-hover:text-orange transition-colors line-clamp-2`}>
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
