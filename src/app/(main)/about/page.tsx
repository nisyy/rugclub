import type { Metadata } from 'next';
import FadeIn from '@/components/ui/FadeIn';
import ConceptSection from './_components/ConceptSection';
import AtmosphereSection from './_components/AtmosphereSection';
import StrengthSection from './_components/StrengthSection';

export const metadata: Metadata = {
  title: 'ABOUT',
  description: 'RUG CLUBのストーリーとコンセプト。日常と芸術表現の境界が溶け合う洗練された空間。',
};

// ─────────────────────────────────────────────
// 1. Page Header
// ─────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="relative bg-cream pt-24 pb-10 lg:pt-28 lg:pb-12 overflow-hidden">
      {/* 背景大テキスト */}
      <div className="absolute inset-0 flex items-start pt-0 pointer-events-none select-none" aria-hidden="true">
        <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">
          ABOUT
        </span>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">
            Our Story &amp; Concept
          </p>
          <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label">
            ABOUT RUG CLUB
          </h1>
        </FadeIn>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader />
      <ConceptSection />
      <AtmosphereSection />
      <StrengthSection />
    </>
  );
}
