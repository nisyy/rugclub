import type { Metadata } from 'next';
import Image from 'next/image';
import { getMenuItems } from '@/lib/notion';
import { DEMO_MENU } from '@/lib/demoData';
import type { AdminMenuItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';
import DrinksLightbox from './_components/DrinksLightbox';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'MENU',
  description: 'RUG CLUBのメニュー。淹れたてコーヒー、職人技のパフェ、季節のスイーツ。',
};

// カテゴリごとの表示ラベル（英語）と配色（見出し・価格バッジ用）
// 「サンド」「デザート」「ドリンク」「モーニング」を含むかで判定するため、
// 過去の表記ゆれ（サンドイッチ / サンドウィッチ 等）があっても正しく一致する
const CATEGORY_KEYWORDS: { match: string; label: string; color: string }[] = [
  { match: 'サンド',     label: 'SANDWICH', color: '#1D4ED8' },
  { match: 'デザート',   label: 'DESSERTS', color: '#06B6D4' },
  { match: 'モーニング', label: 'MORNING',  color: '#A85C32' },
  { match: 'ドリンク',   label: 'DRINKS',   color: '#547443' },
];
const FALLBACK_PALETTE = ['#1A2535', '#EF4123', '#A85C32', '#6B5B3A'];

// カテゴリごとの画像背景色（サンドウィッチ・デザートのみ指定色、他は指定なし＝ニュートラル）
const IMAGE_BG_COLOR: Record<string, string> = {
  SANDWICH: '#65C294',
  DESSERTS: '#65BBE9',
};

interface CategoryGroup {
  category: string;
  label: string;
  color: string;
  items: AdminMenuItem[];
}

function resolveCategoryStyle(category: string): { label: string; color: string } | null {
  const trimmed = category.trim();
  const found = CATEGORY_KEYWORDS.find((k) => trimmed.includes(k.match));
  return found ? { label: found.label, color: found.color } : null;
}

function groupByCategory(items: AdminMenuItem[]): CategoryGroup[] {
  const order: string[] = [];
  const map = new Map<string, { category: string; items: AdminMenuItem[] }>();
  let fallbackIndex = 0;
  const fallbackColors = new Map<string, string>();

  for (const item of items) {
    const rawCategory = item.category || '未分類';
    const style = resolveCategoryStyle(rawCategory);
    // 表記ゆれ（サンドイッチ / サンドウィッチ 等）が同じグループにまとまるよう、
    // 判定できた場合はラベル単位でグルーピングする
    const groupKey = style?.label ?? rawCategory;

    if (!map.has(groupKey)) {
      map.set(groupKey, { category: rawCategory, items: [] });
      order.push(groupKey);
      if (!style) fallbackColors.set(groupKey, FALLBACK_PALETTE[fallbackIndex++ % FALLBACK_PALETTE.length]);
    }
    map.get(groupKey)!.items.push(item);
  }

  return order.map((groupKey) => {
    const { category, items: groupItems } = map.get(groupKey)!;
    const style = resolveCategoryStyle(category);
    return {
      category,
      label: style?.label ?? category,
      color: style?.color ?? fallbackColors.get(groupKey)!,
      items: groupItems,
    };
  });
}

// 商品名の長さに応じてフォントサイズを自動で縮小し、2行に収まりやすくする
function nameFontClass(name: string): string {
  if (name.length <= 9) return 'text-sm';
  if (name.length <= 14) return 'text-xs';
  return 'text-[11px]';
}

function CategoryHeading({ group }: { group: CategoryGroup }) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 mb-2">
      <span className="flex-1 min-w-6 border-t-2 border-dotted" style={{ borderColor: group.color }} />
      <h2
        className="font-display text-base sm:text-3xl tracking-wide uppercase whitespace-nowrap shrink-0"
        style={{ color: group.color }}
      >
        {group.label} MENU
      </h2>
      <span className="flex-1 min-w-6 border-t-2 border-dotted" style={{ borderColor: group.color }} />
    </div>
  );
}

// サンドウィッチ・デザート：画像＋商品名＋価格バッジのグリッド
function ProductGrid({ group }: { group: CategoryGroup }) {
  const imageBg = IMAGE_BG_COLOR[group.label];
  return (
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
          <div
            className="relative aspect-square overflow-hidden rounded-md mb-3"
            style={{ backgroundColor: imageBg ?? 'rgba(26,37,53,0.05)' }}
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain"
            />

            {/* 価格バッジ（スマホ：画像右下に半分重ねて表示） */}
            {item.price && (
              <div
                className="sm:hidden absolute -bottom-3 -right-2 z-10 w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shrink-0 shadow-md"
                style={{ backgroundColor: group.color }}
              >
                <span className="text-[11px] font-bold leading-none">{item.price}</span>
                <span className="text-[7px] leading-none mt-0.5 opacity-80">（税込）</span>
              </div>
            )}
          </div>
          <div className="flex sm:items-center sm:justify-between gap-2">
            <p className={`${nameFontClass(item.name)} font-bold text-charcoal leading-snug flex-1 min-w-0 line-clamp-2`}>
              {item.name}
            </p>

            {/* 価格バッジ（PC：商品名の右に表示） */}
            {item.price && (
              <div
                className="hidden sm:flex w-16 h-16 rounded-full flex-col items-center justify-center text-white shrink-0 shadow-md"
                style={{ backgroundColor: group.color }}
              >
                <span className="text-xs font-bold leading-none">{item.price}</span>
                <span className="text-[8px] leading-none mt-0.5 opacity-80">（税込）</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// モーニング：画像1枚のみ表示（商品名・価格なし）
function MorningSingle({ group }: { group: CategoryGroup }) {
  const item = group.items[0];
  if (!item) return null;
  return (
    <div className="pt-2">
      <div className="overflow-hidden rounded-md bg-navy/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.name || 'モーニング'} className="w-full h-auto object-contain" />
      </div>
    </div>
  );
}

function CategorySection({ group, delay }: { group: CategoryGroup; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <section className="mb-16 last:mb-0">
        <CategoryHeading group={group} />
        {group.label === 'MORNING' && (
          <p className="text-center text-sm text-navy/50 tracking-wide mb-3">9:00 〜 11:00</p>
        )}
        {group.label === 'DRINKS' ? (
          <DrinksLightbox items={group.items} />
        ) : group.label === 'MORNING' ? (
          <MorningSingle group={group} />
        ) : (
          <ProductGrid group={group} />
        )}
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
