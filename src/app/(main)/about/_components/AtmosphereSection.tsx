import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

export default function AtmosphereSection() {
  return (
    <section className="relative bg-accent section-pad">
      {/* 背景の大きな薄い文字 */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 font-display leading-none text-cream/10 text-[18vw] lg:text-[13vw] uppercase pointer-events-none select-none whitespace-nowrap"
      >
        Atmosphere
      </span>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* 左：写真（少し傾けたカード） */}
        <FadeIn>
          <div className="relative max-w-sm mx-auto lg:mx-0">
            <div className="relative bg-white p-3 rounded-lg shadow-xl -rotate-2">
              <div className="relative h-[300px] md:h-[360px] overflow-hidden">
                <Image
                  src="/about/atmosphere.jpg"
                  alt="RUG CLUB 店内のテーブルと椅子"
                  fill
                  sizes="(min-width: 768px) 384px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* 装飾（マスキングテープ） */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 -rotate-3 pointer-events-none select-none">
              <Image src="/about/deco-tape.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </FadeIn>

        {/* 右：テキスト */}
        <div>
          <FadeIn>
            <p className="font-display text-cream text-lg md:text-2xl leading-[1.4] mb-6">
              吹き抜けの開放感と、
              <br />
              木の温もり。
            </p>
          </FadeIn>

          <div className="w-10 h-px bg-cream/40 mb-6" />

          <FadeIn delay={80}>
            <p className="text-sm text-cream/80 leading-[2.1] max-w-md">
              ふらりと立ち寄った古本屋で見つけた一冊の画集や、色褪せた雑誌の表紙。そんな些細な出会いが、今でも心を動かしてくれます。
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
