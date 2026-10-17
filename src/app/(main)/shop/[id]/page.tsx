import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, isPurchasable } from '@/lib/shop/products';
import { formatYen } from '@/lib/shop/format';
import ProductImage from '../_components/ProductImage';
import AddToCart from '../_components/AddToCart';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getProductById(id);
  return { title: p ? p.name : 'SHOP' };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProductById(id);
  if (!p) notFound();
  const purchasable = isPurchasable(p);

  return (
    <div className="bg-cream min-h-screen pt-24 lg:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <Link href="/shop" className="text-[11px] font-bold tracking-[0.25em] text-navy/40 hover:text-navy uppercase transition-colors">
          ← SHOP
        </Link>
        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          <ProductImage src={p.imageUrl} alt={p.name} sizes="(min-width: 768px) 50vw, 100vw" />
          <div>
            {(p.artistName || p.categoryName) && (
              <p className="mb-2 text-xs tracking-wide text-navy/50">{[p.artistName, p.categoryName].filter(Boolean).join(' / ')}</p>
            )}
            <h1 className="text-xl font-bold text-navy leading-snug">{p.name}</h1>
            <p className="mt-3 text-2xl text-navy">{formatYen(p.priceYen)}<span className="text-xs text-navy/40 ml-1">（税込）</span></p>
            <p className="mt-2 text-xs font-semibold tracking-wide" style={{ color: purchasable ? '#547443' : '#EF4123' }}>
              {!purchasable ? '売り切れ' : p.stock <= 3 ? `残りわずか（在庫${p.stock}点）` : '在庫あり'}
            </p>
            <p className="mt-6 text-sm text-navy/70 leading-relaxed whitespace-pre-wrap">{p.description}</p>
            <div className="mt-8">
              <AddToCart productId={p.id} productName={p.name} maxQty={Math.min(p.stock, 99)} purchasable={purchasable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
