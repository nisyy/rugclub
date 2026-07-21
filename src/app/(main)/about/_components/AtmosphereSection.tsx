import MaskRevealHeading from './MaskRevealHeading';
import VerticalLabel from './VerticalLabel';

// 雰囲気セクション：文章は入れず、将来写真を差し込む前提のプレースホルダー枠のみ
export default function AtmosphereSection() {
  return (
    <section className="relative bg-accent section-pad overflow-hidden">
      <VerticalLabel className="text-cream/20">02 — Atmosphere</VerticalLabel>
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <MaskRevealHeading
          as="h2"
          className="font-display text-cream text-2xl md:text-4xl leading-[1.3] mb-10"
        >
          吹き抜けの開放感と、
          <br />
          木の温もり。
        </MaskRevealHeading>

        <div
          className="relative h-[240px] md:h-[360px] rounded-xl border border-dashed border-cream/40 overflow-hidden flex items-center justify-center"
          style={{
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04), rgba(255,255,255,0.18))',
            backgroundSize: '200% 100%',
            animation: 'photoPlaceholderShimmer 3s ease-in-out infinite',
          }}
        >
          <span className="text-cream/60 text-[11px] tracking-[0.2em] uppercase">
            Photo Area（準備中）
          </span>
        </div>
      </div>

      <style>{`
        @keyframes photoPlaceholderShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
