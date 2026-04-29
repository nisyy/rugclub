import Image from 'next/image';
import type { Metadata } from 'next';
import { getMenuItems } from '@/lib/notion';
import { DEMO_MENU } from '@/lib/demoData';
import type { AdminMenuItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeader from '@/components/ui/SectionHeader';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'MENU',
  description: 'RUG CLUBのメニュー。淹れたてコーヒー、職人技のパフェ、季節のスイーツ。',
};

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
const FALLBACK = 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800';

function ItemImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src || FALLBACK}
      alt={alt}
      fill
      className={className ?? 'object-cover group-hover:scale-[1.04] transition-transform duration-500'}
    />
  );
}

// ─────────────────────────────────────────────
// 1. ページヘッダー
// ─────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="bg-orange -mt-16 pt-32 pb-16 lg:pt-36 lg:pb-20">
      <FadeIn>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-charcoal tracking-tight">
            MENU
          </h1>
          <div className="w-14 h-px bg-accent mx-auto my-5" />
          <p className="text-sm text-charcoal/60 leading-relaxed max-w-sm mx-auto">
            淹れたてのコーヒー、職人技が光るパフェ、そして情熱を込めて手作りされた
            季節のスイーツをご用意しております。
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. Coffee セクション
// ─────────────────────────────────────────────
function CoffeeSection({ items }: { items: AdminMenuItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-navy section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <SectionHeader eyebrow="The Art of Extraction" heading="Coffee" className="mb-10" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 80}>
              <article className="group">
                <div className="relative aspect-square overflow-hidden mb-4">
                  <ItemImage src={item.imageUrl} alt={item.name} />
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-sm font-bold text-charcoal leading-snug">{item.name}</h3>
                  <span className="text-sm font-bold text-accent shrink-0 ml-3">{item.price}</span>
                </div>
                {item.description && (
                  <p className="text-xs text-charcoal/60 leading-[1.9]">{item.description}</p>
                )}
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. Parfaits セクション
// ─────────────────────────────────────────────
function ParfaitsSection({ items }: { items: AdminMenuItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-forest section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <SectionHeader
            eyebrow="Sweet Sculptures"
            heading="Parfaits"
            theme="dark"
            align="center"
            className="mb-12"
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 120}>
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-5">
                  <ItemImage src={item.imageUrl} alt={item.name} />
                </div>
                <h3 className="text-base font-bold text-white leading-snug mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-xs text-white/60 leading-[1.9] mb-3">{item.description}</p>
                )}
                <p className="text-sm font-bold text-accent">{item.price}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. Sweets & Lunch セクション
// ─────────────────────────────────────────────
function SweetsLunchSection({
  sweetsItems,
  lunchItems,
}: {
  sweetsItems: AdminMenuItem[];
  lunchItems: AdminMenuItem[];
}) {
  if (sweetsItems.length === 0 && lunchItems.length === 0) return null;

  const featuredLunch = lunchItems[0] ?? null;

  return (
    <section className="bg-navy section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <SectionHeader eyebrow="Crafted Daily" heading="Sweets &amp; Lunch" className="mb-10" />
        </FadeIn>

        {/* Sweets grid */}
        {sweetsItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 mb-16">
            {sweetsItems.map((item, i) => (
              <FadeIn key={item.id} delay={i * 70}>
                <article className="group">
                  <div className="relative aspect-square overflow-hidden mb-3">
                    <ItemImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-charcoal leading-snug mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-accent">{item.price}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Featured Lunch card */}
        {featuredLunch && (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-100">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden group">
                <ItemImage
                  src={featuredLunch.imageUrl}
                  alt={featuredLunch.name}
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
              <div className="flex items-center px-8 sm:px-12 lg:px-14 py-12 bg-white">
                <div>
                  <span className="inline-block text-[10px] font-bold tracking-[0.25em] text-charcoal/70 border border-charcoal/25 px-3 py-1 mb-5 uppercase">
                    LUNCH SPECIAL
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-charcoal leading-snug mb-4">
                    {featuredLunch.name}
                  </h3>
                  {featuredLunch.description && (
                    <p className="text-sm text-charcoal/60 leading-[2] mb-8">
                      {featuredLunch.description}
                    </p>
                  )}
                  <p className="text-3xl md:text-4xl font-black text-charcoal mb-2">
                    {featuredLunch.price}
                  </p>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                    SET PRICE INCLUDES DRINK AND SALAD
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function MenuPage() {
  const notionItems = await getMenuItems();
  const allItems = notionItems.length > 0 ? notionItems : DEMO_MENU;

  const coffeeItems = allItems.filter((i) => i.category === 'Coffee');
  const parfaitItems = allItems.filter((i) => i.category === 'Parfait');
  const sweetsItems = allItems.filter((i) => i.category === 'Sweets');
  const lunchItems = allItems.filter((i) => i.category === 'Lunch');

  return (
    <>
      <PageHeader />
      <CoffeeSection items={coffeeItems} />
      <ParfaitsSection items={parfaitItems} />
      <SweetsLunchSection sweetsItems={sweetsItems} lunchItems={lunchItems} />
    </>
  );
}
