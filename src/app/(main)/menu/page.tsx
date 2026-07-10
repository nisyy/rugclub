import type { Metadata } from 'next';
import { getMenuItems } from '@/lib/notion';
import FadeIn from '@/components/ui/FadeIn';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'MENU',
  description: 'RUG CLUBのメニュー。淹れたてコーヒー、職人技のパフェ、季節のスイーツ。',
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <>
      {/* ヘッダー */}
      <section className="relative bg-cream pt-24 pb-10 lg:pt-28 lg:pb-12 overflow-hidden">
        <div className="absolute inset-0 flex items-start pt-0 pointer-events-none select-none" aria-hidden="true">
          <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">
            MENU
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <FadeIn>
            <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">
              Food &amp; Drinks
            </p>
            <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label">
              MENU
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* メニュー画像一覧 */}
      <section className="bg-cream pb-20">
        <div className="max-w-2xl mx-auto px-4">
          {items.length === 0 ? (
            <p className="text-center py-20 text-navy/40 text-sm">メニューを準備中です。</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, i) => (
                <FadeIn key={item.id} delay={i * 60}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={`メニュー ${i + 1}`}
                    className="w-full h-auto block"
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
