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
    <section className="bg-orange -mt-16 pt-[7.5rem] pb-12 lg:pt-32 lg:pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <p className="font-display text-cream/60 text-xs tracking-[0.4em] uppercase mb-4">
          Latest Updates
        </p>
        <h1 className="font-display text-cream leading-none text-[18vw] sm:text-[14vw] md:text-[10vw] lg:text-[120px]">
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
