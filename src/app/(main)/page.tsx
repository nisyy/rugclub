import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getNewsItems, getGalleryItems } from '@/lib/notion';
import { DEMO_NEWS, DEMO_GALLERY } from '@/lib/demoData';
import type { AdminNewsItem, AdminGalleryItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';
import HeroCarousel from './_components/HeroCarousel';

export const metadata: Metadata = {
  title: { absolute: 'CAFE RUG CLUB | ギャラリーカフェ 東大阪' },
};
export const revalidate = 60;

function formatDate(iso: string) { return iso.replace(/-/g, '.'); }

const NEWS_FALLBACK    = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600';
const GALLERY_FALLBACK = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800';

// ─────────────────────────────────────────────
// Section Label（dilly-dally のセクション名バー）
// ─────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-5 px-6 lg:px-10">
      <h2 className="font-display text-cream text-2xl md:text-3xl tracking-wide">
        {children}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────
// 1. Hero  bg: orange（dilly-dally 風）
// ─────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="bg-orange mx-3 lg:mx-5 mt-16 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">

      {/* ════════════════════════════════
          SP レイアウト（lg 未満のみ表示）
          上: 大見出し → 写真が重なる → 下: 本文
          ════════════════════════════════ */}
      <div className="lg:hidden flex flex-col">

        {/* 見出し（z-10 で写真より前面） */}
        <div className="relative z-10 px-6 pt-10 pb-2">
          <FadeIn>
            <p className="font-display text-cream/60 text-xs tracking-[0.35em] uppercase mb-4">
              Gallery Cafe · Higashi-Osaka
            </p>
            <h1 className="font-display leading-[0.88]">
              <span className="block text-outline text-cream text-[22vw]">
                今日も、
              </span>
              <span className="block text-cream text-[22vw]">
                感性から。
              </span>
            </h1>
          </FadeIn>
        </div>

        {/* カルーセル：-mt で見出し下端に重なる */}
        <div className="relative -mt-[14vw] h-[62vh] overflow-hidden">
          <HeroCarousel />
        </div>

        {/* 本文 + CTA */}
        <div className="px-6 py-10">
          <FadeIn>
            <p className="text-cream/80 text-sm leading-[2] mb-8">
              RUG CLUBのバリスタ・キュレーターが、<br />
              日常のひとときを少しだけ特別なものにします。<br />
              毎日でも通えるように、身近なものから仕入れ、<br />
              感性を持つすべての方へ丁寧に仕込んでご提供します。
            </p>
            <Link href="/about" className="btn-solid">
              RUG CLUB について
            </Link>
          </FadeIn>
        </div>

      </div>

      {/* ════════════════════════════════
          PC レイアウト（lg 以上のみ表示）
          左: 見出し+本文 / 右: カルーセル（浮かせ+少し重なる）
          ════════════════════════════════ */}
      <div className="hidden lg:flex flex-row min-h-[calc(100vh-4.5rem)]">

        {/* 左: テキスト */}
        <div className="flex flex-col justify-between py-14 px-12 w-[45%]">
          <FadeIn>
            <p className="font-display text-cream/60 text-xs tracking-[0.35em] uppercase mb-6">
              Gallery Cafe · Higashi-Osaka
            </p>
            <h1 className="font-display leading-[0.9]">
              <span className="block text-outline text-cream text-[9.5vw]">
                今日も、
              </span>
              <span className="block text-cream text-[9.5vw]">
                感性から。
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={180}>
            <div>
              <p className="text-cream/80 text-sm leading-[2] mb-8">
                RUG CLUBのバリスタ・キュレーターが、<br />
                日常のひとときを少しだけ特別なものにします。<br />
                毎日でも通えるように、身近なものから仕入れ、<br />
                感性を持つすべての方へ丁寧に仕込んでご提供します。
              </p>
              <Link href="/about" className="btn-solid">
                RUG CLUB について
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* 右: カルーセル（上下・右余白で浮かせ、左はテキストに少し被せる） */}
        <div className="relative flex-1 mt-10 mb-10 mr-8 -ml-6 rounded-[1.5rem] overflow-hidden">
          <HeroCarousel />
        </div>

      </div>

    </section>
  );
}

// ─────────────────────────────────────────────
// 2. Concept  bg: navy
// ─────────────────────────────────────────────
function ConceptSection() {
  return (
    <section className="bg-navy mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      <SectionLabel>Concept</SectionLabel>
      <hr className="border-cream/15 mx-6 lg:mx-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 section-pad">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 className="font-display text-cream text-3xl md:text-5xl leading-tight mb-8">
              アートを、<br />もっと身近に。
            </h2>
            <p className="text-cream/70 text-sm leading-[2.2] mb-10">
              RUG CLUBは単なるカフェではありません。日常と芸術表現の境界が溶け合う、
              洗練された空間です。アートは静かなギャラリーの中だけに閉じ込められるべきではない、
              私たちはそう考えています。
            </p>
            <Link href="/about" className="btn-outline text-cream border-cream">
              LEARN MORE
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. Menu Highlights  bg: cream（明るいセクション）
// ─────────────────────────────────────────────
function MenuSection() {
  return (
    <section className="bg-white mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      {/* white bg なので text-navy で見出し */}
      <div className="py-5 px-6 lg:px-10">
        <h2 className="font-display text-navy text-2xl md:text-3xl tracking-wide">
          Menu Highlights
        </h2>
      </div>
      <hr className="border-navy/15 mx-6 lg:mx-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 section-pad">
        <FadeIn>
          <div className="relative aspect-[16/9] max-w-3xl mx-auto overflow-hidden mb-10">
            <Image
              src="https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800"
              alt="メニュー写真"
              fill
              className="object-cover"
            />
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="text-center max-w-xl mx-auto">
            <p className="font-display text-navy text-2xl md:text-3xl mb-4">
              素材の味を、アートのように。
            </p>
            <p className="text-navy/60 text-sm leading-relaxed mb-8">
              スペシャルティコーヒーから職人技のパフェまで、
              すべてはあなたの感性を刺激するために。
            </p>
            <Link href="/menu" className="btn-outline text-navy border-navy">
              MENU を見る
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. Gallery  bg: teal
// ─────────────────────────────────────────────
function GallerySection({ items }: { items: AdminGalleryItem[] }) {
  const display = items.slice(0, 4);
  return (
    <section className="bg-teal mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      <SectionLabel>Gallery</SectionLabel>
      <hr className="border-cream/15 mx-6 lg:mx-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 section-pad">
        {display.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {display.map((item, i) => (
              <FadeIn key={item.id} delay={i * 80}>
                <div className="relative aspect-square overflow-hidden group">
                  <Image
                    src={item.imageUrl || GALLERY_FALLBACK}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <p className="text-cream/50 text-sm py-10 text-center">現在展示中の作品はありません。</p>
        )}
        <FadeIn>
          <div className="text-center">
            <p className="font-display text-cream text-xl md:text-2xl mb-6">
              その場所ならではの美を求めて。
            </p>
            <Link href="/gallery" className="btn-outline text-cream border-cream">
              すべての作品を見る
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. News  bg: olive
// ─────────────────────────────────────────────
function NewsSection({ items }: { items: AdminNewsItem[] }) {
  const display = items.slice(0, 3);
  return (
    <section className="bg-olive mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      <div className="flex items-center justify-between">
        <SectionLabel>News</SectionLabel>
        <Link href="/news"
          className="eyebrow text-cream/60 hover:text-cream transition-colors mr-6 lg:mr-10">
          VIEW ALL →
        </Link>
      </div>
      <hr className="border-cream/15 mx-6 lg:mx-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 section-pad">
        {display.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {display.map((item, i) => (
              <FadeIn key={item.id} delay={i * 100}>
                <Link href={`/news/${item.id}`}>
                  <article className="group">
                    <div className="relative aspect-[4/3] overflow-hidden mb-4">
                      <Image
                        src={item.thumbnailUrl || NEWS_FALLBACK}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>
                    <p className="eyebrow text-orange mb-2">
                      {item.category} · {formatDate(item.date)}
                    </p>
                    <h3 className="font-display text-cream text-base leading-snug mb-2">
                      {item.title}
                    </h3>
                    <span className="eyebrow text-cream/50 group-hover:text-cream transition-colors duration-200">
                      READ MORE →
                    </span>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <p className="text-cream/50 text-sm text-center py-10">最新のニュースはありません。</p>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function HomePage() {
  const [notionNews, notionGallery] = await Promise.all([
    getNewsItems(),
    getGalleryItems(),
  ]);
  const newsItems    = notionNews.length    > 0 ? notionNews    : DEMO_NEWS;
  const galleryItems = notionGallery.length > 0 ? notionGallery : DEMO_GALLERY;

  return (
    <>
      <HeroSection />
      <ConceptSection />
      <MenuSection />
      <GallerySection items={galleryItems} />
      <NewsSection items={newsItems} />
    </>
  );
}
