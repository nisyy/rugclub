import MaskRevealHeading from './MaskRevealHeading';
import VerticalLabel from './VerticalLabel';

// 雰囲気セクション：文章は入れず、将来写真を差し込む前提のプレースホルダー枠のみ
export default function AtmosphereSection() {
  return (
    <section className="relative bg-accent section-pad overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <MaskRevealHeading
          as="h2"
          className="font-display text-cream text-2xl md:text-4xl leading-[1.3] mb-10"
        >
          吹き抜けの開放感と、
          <br />
          木の温もり。
        </MaskRevealHeading>

        {/* 有機的な切り抜き形状を定義（写真プレースホルダー・将来の実写真の両方に使用） */}
        <svg width="0" height="0" aria-hidden="true">
          <defs>
            <clipPath id="atmosphere-blob-clip" clipPathUnits="objectBoundingBox">
              <path d="M0.045,0.19 C0.02,0.09 0.12,0.02 0.27,0.02 C0.42,0.02 0.58,-0.02 0.74,0.01 C0.9,0.03 0.98,0.11 0.97,0.24 C0.96,0.36 0.99,0.48 0.98,0.62 C0.97,0.78 0.97,0.9 0.83,0.96 C0.68,1.02 0.5,0.97 0.34,0.99 C0.2,1.0 0.06,0.98 0.03,0.84 C0.01,0.72 0.04,0.58 0.02,0.44 C0.005,0.33 0.06,0.27 0.045,0.19 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* 写真プレースホルダー枠 + 背後の装飾テキスト */}
        <div className="relative">
          <VerticalLabel orientation="horizontal" align="center" className="text-cream/20 z-0">
            Atmosphere
          </VerticalLabel>

          <div
            className="relative z-10 h-[260px] md:h-[380px] flex items-center justify-center"
            style={{
              clipPath: 'url(#atmosphere-blob-clip)',
              background:
                'linear-gradient(120deg, rgba(255,255,255,0.20), rgba(255,255,255,0.05), rgba(255,255,255,0.20))',
              backgroundSize: '200% 100%',
              animation: 'photoPlaceholderShimmer 3s ease-in-out infinite',
            }}
          >
            <span className="text-cream/60 text-[11px] tracking-[0.2em] uppercase">
              Photo Area（準備中）
            </span>
          </div>
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
