import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import SquiggleUnderline from './SquiggleUnderline';

export default function StorySection() {
  return (
    <section className="bg-cream section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* 左：テキスト */}
        <div>
          <MaskRevealHeading
            as="h2"
            className="font-display text-navy text-3xl md:text-5xl leading-[1.3] mb-3"
          >
            身近に、
            <br />
            アートを感じる場所。
          </MaskRevealHeading>

          <SquiggleUnderline className="text-accent mb-8" />

          <FadeIn>
            <p className="text-sm text-navy/70 leading-[2.1] max-w-md">
              「将来カフェなんかできたらいいよなぁ」。中学のラグビー部の仲間と交わした、なにげないひとことが原点です。RUG
              CLUBという名前には、その頃の記憶が込められています。
            </p>
          </FadeIn>
        </div>

        {/* 右：写真（有機的な切り抜き形状） */}
        <FadeIn delay={80}>
          <div className="relative">
            <svg width="0" height="0" aria-hidden="true">
              <defs>
                <clipPath id="hero-blob-clip" clipPathUnits="objectBoundingBox">
                  <path d="M0.045,0.19 C0.02,0.09 0.12,0.02 0.27,0.02 C0.42,0.02 0.58,-0.02 0.74,0.01 C0.9,0.03 0.98,0.11 0.97,0.24 C0.96,0.36 0.99,0.48 0.98,0.62 C0.97,0.78 0.97,0.9 0.83,0.96 C0.68,1.02 0.5,0.97 0.34,0.99 C0.2,1.0 0.06,0.98 0.03,0.84 C0.01,0.72 0.04,0.58 0.02,0.44 C0.005,0.33 0.06,0.27 0.045,0.19 Z" />
                </clipPath>
              </defs>
            </svg>

            <div
              className="relative h-[340px] md:h-[440px] overflow-hidden"
              style={{ clipPath: 'url(#hero-blob-clip)' }}
            >
              <Image
                src="/about/hero.jpg"
                alt="RUG CLUB 店内"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* 装飾（ブラシストローク） */}
            <div className="absolute -top-16 -left-24 w-[384px] h-[168px] -rotate-6 pointer-events-none select-none">
              <Image src="/about/deco-brush1.png" alt="" fill className="object-contain" />
            </div>
            <div className="absolute -bottom-24 -right-20 w-[336px] h-[192px] rotate-3 pointer-events-none select-none">
              <Image src="/about/deco-brush3.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
