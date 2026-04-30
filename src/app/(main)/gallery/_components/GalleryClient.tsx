'use client';

import { useState } from 'react';
import type { AdminGalleryItem } from '@/types/admin';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeader from '@/components/ui/SectionHeader';
import CTAButton from '@/components/ui/CTAButton';

// ─────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────
type FilterStatus = 'all' | 'available' | 'sold';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'すべての作品', value: 'all' },
  { label: '販売中', value: 'available' },
  { label: '売約済', value: 'sold' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800';

// 1. PageHeader (変更なし)
function PageHeader({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
}) {
  return (
    <section className="relative bg-cream pt-24 pb-10 lg:pt-28 lg:pb-12 overflow-hidden">
      <div className="absolute inset-0 flex items-start pt-0 pointer-events-none select-none" aria-hidden="true">
        <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">
          GALLERY
        </span>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <FadeIn>
            <div className="max-w-md">
              <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">Exhibition</p>
              <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label mb-4">GALLERY</h1>
              <p className="text-sm text-navy/60 mt-4 leading-relaxed">
                Cafe RUG CLUBで現在展示中のユニークな作品をご覧ください。すべての作品には物語があり、購入を通じて地元のアーティストを支援することができます。
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="flex items-center gap-2 shrink-0">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onFilterChange(f.value)}
                  className={`text-xs font-semibold tracking-wide px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeFilter === f.value ? 'bg-charcoal text-white' : 'bg-white text-charcoal border border-charcoal/20 hover:border-charcoal/50'
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

// 2. ArtworkGrid (Masonry レイアウトへ変更)
function ArtworkGrid({ items }: { items: AdminGalleryItem[] }) {
  return (
    <section className="bg-cream pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">該当する作品がありません。</p>
          </div>
        ) : (
          /* 不規則配置: columns-1 (スマホ), columns-2 (タブレット), columns-3 (PC) */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((art, i) => (
              <FadeIn key={art.id} delay={(i % 3) * 80}>
                {/* break-inside-avoid: 列の途中でカードが切れるのを防ぐ */}
                <article className="break-inside-avoid mb-6 group cursor-pointer">
                  <div className="relative overflow-hidden bg-navy/5">
                    {/* imgタグでアス比を維持 (w-full h-auto) */}
                    <img
                      src={art.imageUrl || FALLBACK}
                      alt={art.title}
                      className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-700"
                      loading="lazy"
                    />
                    
                    {/* 売約済バッジ */}
                    {art.status === 'sold' && (
                      <div className="absolute top-4 left-4 bg-charcoal/80 text-white text-[10px] font-semibold tracking-widest px-2.5 py-1 z-10">
                        SOLD
                      </div>
                    )}

                    {/* ホバー時のオーバーレイ（不規則配置をよりおしゃれに） */}
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* キャプション */}
                  <div className="mt-4 px-1">
                    <p className="text-sm font-semibold text-charcoal tracking-tight">{art.title}</p>
                    <p className="text-[11px] text-charcoal/50 mt-1 uppercase tracking-widest">{art.artist}</p>
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

// 3. FeaturedArtist (変更なし)
function FeaturedArtist() {
  return (
    <section className="bg-white py-16 lg:py-20 border-y border-navy/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="bg-cream rounded-2xl px-8 sm:px-12 py-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <SectionHeader eyebrow="今月のアーティスト" heading="坂本 将" className="mb-6" />
              <p className="text-sm text-charcoal/60 leading-[2.2] max-w-sm mb-8">
                ポートランドを拠点に活動する坂本の作品は、朝の儀式と感情の風景が交差する地点を探求しています。コーヒーで染めたような質感と、鮮やかな厚塗りの油彩は、RUG CLUBコレクションの代名詞となっています。
              </p>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] text-charcoal hover:text-orange transition-colors uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></svg>
                Follow on Instagram
              </a>
            </div>
            <div className="flex gap-4 w-full md:w-auto shrink-0 justify-center">
              <div className="relative w-40 h-56 sm:w-48 sm:h-64 overflow-hidden rounded-lg group">
                <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600" alt="制作中" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative w-40 h-56 sm:w-48 sm:h-64 overflow-hidden rounded-lg group">
                <img src="https://images.unsplash.com/photo-1560421683-6856ea585c78?w=600" alt="道具" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// 4. SubmissionCTA (変更なし)
function SubmissionCTA() {
  return (
    <section className="bg-cream py-20 lg:py-32">
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

// Root Client Component
export default function GalleryClient({ items }: { items: AdminGalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filteredItems =
    activeFilter === 'all' ? items : items.filter((art) => art.status === activeFilter);

  return (
    <main className="bg-cream min-h-screen">
      <PageHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <ArtworkGrid items={filteredItems} />
      <FeaturedArtist />
      <SubmissionCTA />
    </main>
  );
}