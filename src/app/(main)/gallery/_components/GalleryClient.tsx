'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { AdminGalleryItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeader from '@/components/ui/SectionHeader';
import CTAButton from '@/components/ui/CTAButton';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type FilterStatus = 'all' | 'available' | 'sold';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'すべての作品', value: 'all' },
  { label: '販売中', value: 'available' },
  { label: '売約済', value: 'sold' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800';

// ─────────────────────────────────────────────
// 1. ページヘッダー + フィルター
// ─────────────────────────────────────────────
function PageHeader({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
}) {
  return (
    <section className="bg-cream -mt-16 pt-[7.5rem] pb-10 lg:pt-32 lg:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* 左：タイトル + 説明文 */}
          <FadeIn>
            <div className="max-w-md">
              <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold text-charcoal leading-none tracking-tight">
                GALLERY
              </h1>
              <p className="text-sm text-charcoal/60 mt-4 leading-relaxed">
                Cafe RUG CLUBで現在展示中のユニークな作品をご覧ください。すべての作品には
                物語があり、購入を通じて地元のインディペンデント・アーティストを支援する
                ことができます。
              </p>
            </div>
          </FadeIn>

          {/* 右：フィルターボタン */}
          <FadeIn delay={120}>
            <div className="flex items-center gap-2 shrink-0">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onFilterChange(f.value)}
                  className={`text-xs font-semibold tracking-wide px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeFilter === f.value
                      ? 'bg-charcoal text-white'
                      : 'bg-white text-charcoal border border-charcoal/20 hover:border-charcoal/50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. 作品グリッド
// ─────────────────────────────────────────────
function ArtworkGrid({ items }: { items: AdminGalleryItem[] }) {
  return (
    <section className="bg-cream pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">該当する作品がありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((art, i) => (
              <FadeIn key={art.id} delay={(i % 3) * 90}>
                <article className="group cursor-pointer">
                  {/* 正方形画像（角丸なし） */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={art.imageUrl || FALLBACK}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-600"
                    />
                    {/* 売約済バッジ */}
                    {art.status === 'sold' && (
                      <div className="absolute top-3 left-3 bg-charcoal/80 text-white text-[10px] font-semibold tracking-widest px-2.5 py-1">
                        SOLD
                      </div>
                    )}
                  </div>
                  {/* カード下テキスト */}
                  <div className="mt-2.5">
                    <p className="text-sm font-semibold text-charcoal">{art.title}</p>
                    <p className="text-xs text-charcoal/60 mt-0.5">{art.artist}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. 今月のアーティスト（静的セクション）
// ─────────────────────────────────────────────
function FeaturedArtist() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="bg-cream rounded-xl px-8 sm:px-12 py-10 flex flex-col md:flex-row gap-10 items-start">
            {/* 左：テキストコンテンツ */}
            <div className="flex-1">
              <SectionHeader
                eyebrow="今月のアーティスト"
                heading="坂本 将"
                className="mb-5"
              />
              <p className="text-sm text-charcoal/60 leading-[2] max-w-sm mb-8">
                ポートランドを拠点に活動する坂本の作品は、朝の儀式と感情の風景が交差する
                地点を探求しています。コーヒーで染めたような質感と、鮮やかなインパスト
                （厚塗り）の油彩は、RUG CLUBコレクションの代名詞となっています。
              </p>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-charcoal hover:text-accent transition-colors duration-200 uppercase"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                Follow on Instagram
              </a>
            </div>

            {/* 右：2枚の写真 */}
            <div className="flex gap-3 w-full md:w-auto shrink-0">
              <div className="relative w-40 h-52 sm:w-48 sm:h-60 overflow-hidden rounded-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"
                  alt="坂本 将 - 制作中"
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
              <div className="relative w-40 h-52 sm:w-48 sm:h-60 overflow-hidden rounded-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1560421683-6856ea585c78?w=600"
                  alt="絵筆と道具"
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. 作品募集セクション
// ─────────────────────────────────────────────
function SubmissionCTA() {
  return (
    <section className="bg-cream section-pad">
      <FadeIn>
        <div className="max-w-lg mx-auto px-6 text-center">
          <SectionHeader
            eyebrow="Open Call"
            heading="あなたの作品を展示しませんか？"
            body="私たちは、常に新しい視点を持つ作品を募集しています。応募は四半期ごとに行っています。"
            align="center"
            className="mb-10"
          />
          <CTAButton href="/contact" variant="outline">応募する</CTAButton>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────────
// Root Client Component
// ─────────────────────────────────────────────
export default function GalleryClient({ items }: { items: AdminGalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filteredItems =
    activeFilter === 'all' ? items : items.filter((art) => art.status === activeFilter);

  return (
    <>
      <PageHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <ArtworkGrid items={filteredItems} />
      <FeaturedArtist />
      <SubmissionCTA />
    </>
  );
}
