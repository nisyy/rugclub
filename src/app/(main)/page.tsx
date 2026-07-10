import Link from 'next/link';
import type { Metadata } from 'next';
import { getNewsItems, getGalleryItems } from '@/lib/notion';
import { DEMO_NEWS, DEMO_GALLERY } from '@/lib/demoData';
import type { AdminNewsItem, AdminGalleryItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';
import HeroCarousel from './_components/HeroCarousel';
import MenuCarousel from './_components/MenuCarousel';

export const metadata: Metadata = {
  title: { absolute: 'CAFE RUG CLUB | ギャラリーカフェ 東大阪' },
};
export const revalidate = 60;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}.${Number(m)}.${Number(d)}`;
}

const CATEGORY_LABEL: Record<string, string> = { 'NEWS & EVENTS': 'EVENT' };
function displayCat(cat: string): string {
  return CATEGORY_LABEL[cat] ?? cat;
}

function ArrowCircle() {
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-navy/25 text-navy group-hover:bg-navy group-hover:text-cream group-hover:border-navy transition-all duration-300 shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

const GALLERY_FALLBACK = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-5 px-6 lg:px-10">
      <h2 className="font-display text-cream text-2xl md:text-3xl tracking-wide">
        {children}
      </h2>
    </div>
  );
}

// --- 1. Hero ---
function HeroSection() {
  return (
    <section className="bg-orange mx-3 lg:mx-5 mb-5 mt-[60px] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      <div className="lg:hidden flex flex-col">
        <div className="relative z-10 px-6 pt-10 pb-2">
          <FadeIn>
            <p className="font-display text-cream/60 text-xs tracking-[0.35em] uppercase mb-4">Gallery Cafe</p>
            <h1 className="font-display leading-[0.9]">
              <span className="block text-outline text-cream text-[10vw]">Where</span>
              <span className="block text-cream text-[10vw] pl-[18vw]">coffee</span>
              <span className="block text-outline text-cream text-[10vw] pl-[8vw]">meets</span>
              <span className="block text-cream text-[10vw] pl-[32vw]">art.</span>
            </h1>
          </FadeIn>
        </div>
        <div className="relative -mt-[14vw] aspect-[4/3] overflow-hidden">
          <HeroCarousel />
        </div>
        <div className="px-6 py-10">
          <FadeIn>
            <p className="white text-sm leading-[2] mb-8">
アートを身近に感じ、いつ来ても新鮮な気分を味わってもらえるようこだわり抜いて選んだ什器がある特別な空間の中で、コーヒーと軽食、お酒をご提供します。
            </p>
            <Link href="/about" className="btn-solid">RUG CLUB について</Link>
          </FadeIn>
        </div>
      </div>
      <div className="hidden lg:flex flex-row min-h-[calc(100vh-4.5rem)]">
        <div className="flex flex-col justify-between py-14 px-12 w-[45%]">
          <FadeIn>
            <p className="font-display text-cream/60 text-xs tracking-[0.35em] uppercase mb-6">Gallery Cafe</p>
            <h1 className="font-display leading-[0.9]">
              <span className="block text-outline text-cream text-[9.5vw]">Where</span>
              <span className="block text-cream text-[9.5vw] pl-[3vw]">coffee</span>
              <span className="block text-outline text-cream text-[9.5vw] pl-[1.5vw]">meets</span>
              <span className="block text-cream text-[9.5vw] pl-[4.5vw]">art.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={180}>
            <div>
              <p className="text-cream/80 text-sm leading-[2] mb-8">
アートを身近に感じ、いつ来ても新鮮な気分を味わってもらえるようこだわり抜いて選んだ什器がある特別な空間の中で、コーヒーと軽食、お酒をご提供します。
              </p>
              <Link href="/about" className="btn-solid">RUG CLUB について</Link>
            </div>
          </FadeIn>
        </div>
        <div className="relative flex-1 mt-10 mb-10 mr-8 -ml-6 rounded-[1.5rem] overflow-hidden">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}

// --- 2. Menu ---
function MenuSection() {
  return (
    <section className="bg-white mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      <div className="py-5 px-6 lg:px-10">
        <h2 className="font-display text-navy text-2xl md:text-3xl tracking-wide">Menu</h2>
      </div>
      <hr className="border-navy/15 mx-6 lg:mx-10" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-2 pb-8">
        <MenuCarousel />
        <div className="grid grid-cols-3 items-center mt-2">
          <div />
          <div className="flex justify-center">
            <Link
              href="/menu"
              className="btn-outline text-navy border-navy whitespace-nowrap !px-4"
            >
              MENU を見る
            </Link>
          </div>
          <div className="flex items-center pl-4">
            <p className="text-[9px] text-navy/50 tracking-wide">※全て税込価格となります</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 3. Gallery (Masonry: 不規則配置) ---
function GallerySection({ items }: { items: AdminGalleryItem[] }) {
  const display = items.slice(0, 8); 
  return (
    <section className="bg-teal mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      <SectionLabel>Gallery</SectionLabel>
      <hr className="border-cream/15 mx-6 lg:mx-10" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 section-pad">
        {display.length > 0 ? (
          /* Masonry 配置: 列数を指定し、中の要素の break-inside-avoid を使う */
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {display.map((item, i) => (
              <FadeIn key={item.id} delay={i * 50} className="break-inside-avoid mb-4">
                <div className="group relative overflow-hidden rounded-xl bg-navy/5">
                  <img
                    src={item.imageUrl || GALLERY_FALLBACK}
                    alt={item.title}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-cream text-xs font-bold leading-tight">{item.title}</p>
                    <p className="text-cream/70 text-[10px] mt-1">{item.artist}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <p className="text-cream/50 text-sm py-10 text-center">現在展示中の作品はありません。</p>
        )}
        <div className="text-center mt-12">
          <Link href="/gallery" className="btn-outline text-cream border-cream">すべての作品を見る</Link>
        </div>
      </div>
    </section>
  );
}

// --- 4. News ---
function NewsSection({ items }: { items: AdminNewsItem[] }) {
  const display = items.slice(0, 3);
  return (
    <section className="mb-5 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="pt-5 pb-4">
        <h2 className="font-display text-navy text-2xl md:text-3xl tracking-wide">News</h2>
      </div>
      <hr className="border-navy/15" />
      {display.length > 0 ? (
        <ul>
          {display.map((item) => (
            <li key={item.id}>
              <Link href={`/news/${item.id}`} className="block group py-5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-[0.08em] text-navy/55">（{displayCat(item.category)}）</span>
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-navy/40">{formatDate(item.date)}</span>
                  </div>
                  <ArrowCircle />
                </div>
                <h3 className="text-sm font-bold text-navy group-hover:text-orange transition-colors">{item.title}</h3>
              </Link>
              <div className="h-px bg-navy/12" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-navy/40 text-sm text-center py-10">最新のニュースはありません。</p>
      )}
      <div className="mt-8 text-center">
        <Link href="/news" className="btn-pill">MORE</Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [notionNews, notionGallery] = await Promise.all([
    getNewsItems(),
    getGalleryItems(),
  ]);
  const newsItems = notionNews.length > 0 ? notionNews : DEMO_NEWS;
  const galleryItems = notionGallery.length > 0 ? notionGallery : DEMO_GALLERY;

  return (
    <main className="bg-cream min-h-screen pb-10">
      <HeroSection />
      <MenuSection />
      <GallerySection items={galleryItems} />
      <NewsSection items={newsItems} />
    </main>
  );
}