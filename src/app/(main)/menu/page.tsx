import type { Metadata } from 'next';
import { getMenuItems } from '@/lib/notion';
import { DEMO_MENU } from '@/lib/demoData';
import type { AdminMenuItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'MENU',
  description: 'RUG CLUBのメニュー。淹れたてコーヒー、職人技のパフェ、季節のスイーツ。',
};

// カテゴリごとの表示ラベル（英語）と配色
const CATEGORY_STYLE: Record<string, { label: string; color: string }> = {
  'サンドウィッチ': { label: 'SANDWICH', color: '#1D4ED8' },
  'デザート':       { label: 'DESSERTS', color: '#06B6D4' },
  'ドリンク':       { label: 'DRINKS',   color: '#547443' },
};
const FALLBACK_PALETTE = ['#1A2535', '#EF4123', '#A85C32', '#6B5B3A'];

interface CategoryGroup {
  category: string;
  label: string;
  color: string;
  items: AdminMenuItem[];
}

function groupByCategory(items: AdminMenuItem[]): CategoryGroup[] {
  const order: string[] = [];
  const map = new Map<string, AdminMenuItem[]>();
  for (const item of items) {
    const cat = item.category || '未分類';
    if (!map.has(cat)) {
      map.set(cat, []);
      order.push(cat);
    }
    map.get(cat)!.push(item);
  }
  let fallbackIndex = 0;
  return order.map((category) => {
    const style = CATEGORY_STYLE[category];
    return {
      category,
      label: style?.label ?? category,
      color: style?.color ?? FALLBACK_PALETTE[fallbackIndex++ % FALLBACK_PALETTE.length],
      items: map.get(category)!,
    };
  });
}

function CategorySection({ group, delay }: { group: CategoryGroup; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <section className="mb-16 last:mb-0">
        {/* カテゴリヘッダー：点線 + カテゴリ名 + 点線 */}
        <div className="flex items-center gap-2 sm:gap-4 mb-2">
          <span
            className="flex-1 min-w-6 border-t-2 border-dotted"
            style={{ borderColor: group.color }}
          />
          <h2
            className="font-display text-base sm:text-3xl tracking-wide uppercase whitespace-nowrap shrink-0"
            style={{ color: group.color }}
          >
            {group.label} MENU
          </h2>
          <span
            className="flex-1 min-w-6 border-t-2 border-dotted"
            style={{ borderColor: group.color }}
          />
        </div>

        {/* 商品グリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-dotted" style={{ borderColor: `${group.color}55` }}>
          {group.items.map((item, i) => (
            <div
              key={item.id}
              className="px-4 py-6 border-dotted"
              style={{
                borderColor: `${group.color}55`,
                borderRightWidth: (i + 1) % 4 === 0 ? 0 : 1,
                borderBottomWidth: 1,
              }}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl mb-3 bg-navy/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm font-bold text-charcoal leading-snug flex-1 min-w-0">
                  {item.name}
                </p>

                {/* 価格バッジ */}
                {item.price && (
                  <div
                    className="self-end sm:self-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center text-white shrink-0 shadow-md"
                    style={{ backgroundColor: group.color }}
                  >
                    <span className="text-[11px] sm:text-xs font-bold leading-none">{item.price}</span>
                    <span className="text-[7px] sm:text-[8px] leading-none mt-0.5 opacity-80">（税込）</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

export default async function MenuPage() {
  const notionItems = await getMenuItems();
  const items = notionItems.length > 0 ? notionItems : DEMO_MENU;
  const groups = groupByCategory(items);

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

      {/* メニュー一覧 */}
      <section className="bg-cream pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {groups.length === 0 ? (
            <p className="text-center py-20 text-navy/40 text-sm">メニューを準備中です。</p>
          ) : (
            groups.map((group, i) => (
              <CategorySection key={group.category} group={group} delay={i * 60} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
