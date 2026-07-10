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

// カテゴリごとに割り当てる配色（サイトのブランドカラーを基調にしたローテーション）
const CATEGORY_PALETTE = [
  '#1A2535', // navy
  '#EF4123', // orange
  '#547443', // teal / forest
  '#3F5B77', // slate blue
  '#A85C32', // rust
  '#6B5B3A', // olive brown
];

interface CategoryGroup {
  category: string;
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
  return order.map((category, i) => ({
    category,
    color: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
    items: map.get(category)!,
  }));
}

function CategorySection({ group, delay }: { group: CategoryGroup; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <section className="mb-16 last:mb-0">
        {/* カテゴリヘッダー：点線 + カテゴリ名 + 点線 */}
        <div className="flex items-center gap-4 mb-2">
          <span
            className="flex-1 border-t-2 border-dotted"
            style={{ borderColor: group.color }}
          />
          <h2
            className="font-display text-2xl sm:text-3xl tracking-wide uppercase whitespace-nowrap"
            style={{ color: group.color }}
          >
            {group.category} MENU
          </h2>
          <span
            className="flex-1 border-t-2 border-dotted"
            style={{ borderColor: group.color }}
          />
        </div>

        {/* 商品グリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-dotted" style={{ borderColor: `${group.color}55` }}>
          {group.items.map((item, i) => (
            <div
              key={item.id}
              className="relative px-4 py-6 border-dotted"
              style={{
                borderColor: `${group.color}55`,
                borderRightWidth: (i + 1) % 4 === 0 ? 0 : 1,
                borderBottomWidth: 1,
              }}
            >
              <div className="relative aspect-square overflow-hidden rounded-full mx-auto w-[80%] mb-3 bg-navy/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-center text-sm font-bold text-charcoal leading-snug px-1">
                {item.name}
              </p>

              {/* 価格バッジ */}
              {item.price && (
                <div
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: group.color }}
                >
                  <span className="text-[11px] sm:text-xs font-bold leading-none">{item.price}</span>
                  <span className="text-[7px] sm:text-[8px] leading-none mt-0.5 opacity-80">（税込）</span>
                </div>
              )}
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
