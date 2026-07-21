import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import PillArrowLink from './PillArrowLink';
import DecorationPlaceholder from './DecorationPlaceholder';

export default function AtmosphereSection() {
  return (
    <section id="atmosphere" className="relative bg-accent section-pad overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* 左：写真（少し傾けたカード） */}
        <FadeIn>
          <div className="relative max-w-sm mx-auto lg:mx-0">
            <div className="relative h-[300px] md:h-[360px] rounded-2xl overflow-hidden shadow-xl -rotate-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
                alt="RUG CLUBのコーヒー"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 装飾プレースホルダー（後日、透過PNGに差し替え） */}
            <DecorationPlaceholder label="画像3（マスキングテープ）" className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 rotate-3" />
            <DecorationPlaceholder label="画像4（手描きスクリブル）" className="absolute -bottom-5 -left-5 w-16 h-16" />
          </div>
        </FadeIn>

        {/* 右：テキスト */}
        <div>
          <MaskRevealHeading
            as="h2"
            className="font-display text-cream text-3xl md:text-5xl leading-[1.2] mb-4"
          >
            Atmosphere
          </MaskRevealHeading>

          <FadeIn>
            <p className="font-display text-cream text-lg md:text-2xl leading-[1.4] mb-6">
              吹き抜けの開放感と、
              <br />
              木の温もり。
            </p>
          </FadeIn>

          <div className="w-10 h-px bg-cream/40 mb-6" />

          <FadeIn delay={80}>
            <p className="text-sm text-cream/80 leading-[2.1] mb-10 max-w-md">
              ふらりと立ち寄った古本屋で見つけた一冊の画集や、色褪せた雑誌の表紙。そんな些細な出会いが、今でも心を動かしてくれます。
            </p>
          </FadeIn>

          <FadeIn delay={160}>
            <PillArrowLink href="/gallery">店内の雰囲気を見る</PillArrowLink>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
