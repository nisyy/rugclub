import type { Metadata } from 'next';
import NewsListClient from './_components/NewsListClient';
import { getNewsItems } from '@/lib/notion';
import { DEMO_NEWS } from '@/lib/demoData';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'NEWS',
  description: 'Cafe RUG CLUBの最新ニュース・イベント情報をお届けします。',
};

// ─── ページヘッダー ────────────────────────────
function PageHeader() {
  return (
    <section className="relative bg-cream pt-24 pb-10 lg:pt-28 lg:pb-12 overflow-hidden">
      {/* 背景大テキスト */}
      <div className="absolute inset-0 flex items-start pt-0 pointer-events-none select-none" aria-hidden="true">
        <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">
          NEWS
        </span>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10">
        <p className="font-display text-navy/40 text-[10px] tracking-[0.4em] uppercase mb-3">
          Latest Updates
        </p>
        <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label">
          NEWS
        </h1>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────
export default async function NewsPage() {
  const notionItems = await getNewsItems();
  const items = notionItems.length > 0 ? notionItems : DEMO_NEWS;
  return (
    <>
      <PageHeader />
      {/* useState を使うリスト+ページネーションはクライアントコンポーネントに委譲 */}
      <NewsListClient items={items} />
    </>
  );
}
