import type { Metadata } from 'next';
import Link from 'next/link';
import { byNewest, byPopular, getProducts, getTaxonomies, isPurchasable } from '@/lib/shop/products';
import { formatYen } from '@/lib/shop/format';
import { matchesSearch } from '@/lib/shop/search';
import ProductImage from './_components/ProductImage';
import SortMenu from './_components/SortMenu';
import ShopHeading from './_components/ShopHeading';
import DevNotice from './_components/DevNotice';

export const metadata: Metadata = {
  title: 'SHOP',
  description: 'RUG CLUBのオンラインショップ。グッズ・作品の一覧です。',
};

export const revalidate = 30;

type Sort = 'new' | 'popular';

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`shrink-0 whitespace-nowrap text-xs font-semibold tracking-wide px-3.5 sm:px-4 py-2 rounded-full transition-colors ${active ? 'bg-navy text-cream' : 'bg-white text-navy border border-navy/20 hover:border-navy/50'}`}>
      {children}
    </Link>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string; q?: string }> }) {
  const sp = await searchParams;
  const category = sp.category;
  const sort: Sort = sp.sort === 'popular' ? 'popular' : 'new';
  const q = (sp.q ?? '').slice(0, 100).trim();

  const [all, tax] = await Promise.all([getProducts(), getTaxonomies()]);
  const products = all
    .filter((p) => (!category || p.categoryId === category) && matchesSearch(q, [p.name, p.artistName, p.categoryName, p.description]))
    .sort(sort === 'popular' ? byPopular : byNewest);
  const usedCategories = tax.categories.filter((c) => all.some((p) => p.categoryId === c.id));

  const href = (o: { category?: string; sort?: Sort; q?: string }) => {
    const next = { category, sort, q, ...o };
    const params = new URLSearchParams();
    if (next.category) params.set('category', next.category);
    if (next.sort === 'popular') params.set('sort', 'popular');
    if (next.q) params.set('q', next.q);
    const qs = params.toString();
    return qs ? `/shop?${qs}` : '/shop';
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Online Shop" title="SHOP" bg="SHOP" />
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <DevNotice>
          オンラインショップは準備中です。表示中の商品はサンプルで、現在ご注文・決済はできません。
        </DevNotice>

        {/* 検索 */}
        <div className="sticky top-16 z-40 -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 mb-4 bg-cream/95 backdrop-blur-sm">
        <form action="/shop" method="get" role="search" className="flex gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          {sort === 'popular' && <input type="hidden" name="sort" value="popular" />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="作家名・商品名・カテゴリで検索"
            aria-label="商品を検索"
            maxLength={100}
            className="flex-1 min-w-0 bg-white border border-navy/20 rounded-full px-5 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-orange transition-colors"
          />
          <button type="submit" className="shrink-0 bg-navy text-cream text-xs font-bold tracking-widest px-6 rounded-full hover:opacity-80 transition-opacity">検索</button>
        </form>
        </div>

        {/* 並び順（カテゴリの上・右寄せ） */}
        <div className="mb-5 flex justify-end">
          <SortMenu options={[{ label: '新着順', href: href({ sort: 'new' }), active: sort === 'new' }, { label: '人気順', href: href({ sort: 'popular' }), active: sort === 'popular' }]} />
        </div>

        <div className="mb-8 space-y-3">
          {usedCategories.length > 0 && (
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[10px] sm:text-[11px] tracking-[0.2em] text-navy/40 sm:w-24 shrink-0">CATEGORY</span>
              <div className="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0 pb-1 sm:pb-0 scrollbar-none">
                <Chip href={href({ category: undefined })} active={!category}>すべて</Chip>
                {usedCategories.map((c) => <Chip key={c.id} href={href({ category: c.id })} active={category === c.id}>{c.name}</Chip>)}
              </div>
            </div>
          )}
        </div>

        {(q || category) && (
          <p className="mb-6 text-xs text-navy/50" aria-live="polite">
            {q && <>「{q}」の検索結果　</>}{products.length}件
            <Link href="/shop" className="ml-3 text-orange underline underline-offset-2">条件をクリア</Link>
          </p>
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
