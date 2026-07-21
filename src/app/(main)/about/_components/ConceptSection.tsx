import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import SquiggleUnderline from './SquiggleUnderline';

export default function ConceptSection() {
  return (
    <section className="relative bg-cream section-pad overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* 左：テキスト */}
        <div>
          <MaskRevealHeading
            as="h2"
            className="font-display text-navy text-3xl md:text-5xl leading-[1.2] mb-3"
          >
            Concept
          </MaskRevealHeading>

          <p className="font-display text-navy text-lg md:text-2xl leading-[1.4] mb-2">
            常に、
            <br />
            アートを感じられる場所。
          </p>
          <SquiggleUnderline className="text-accent mb-8" />

          <FadeIn>
            <p className="text-sm text-navy/70 leading-[2.1] mb-6 max-w-md">
              ギャラリーカフェという業態は、そう珍しいものではありません。だからこそ気負うことなく、これまで培ってきたアートの知識を活かせる場所として、コーヒーとアートを組み合わせました。
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <p className="text-sm text-navy/70 leading-[2.1] mb-10 max-w-md">
              家具はひとつひとつ、自分たちの目で選んだ60年代からのヴィンテージ。店内には20点ほどの作品を展示し、料理を待つ時間はスマホではなくアートを眺めて過ごす、そんなひとときを大切にしています。
            </p>
          </FadeIn>

          <FadeIn delay={160}>
            {/* 吹き出し */}
            <div className="relative bg-cream border border-accent/30 rounded-2xl px-6 py-5 mb-10 max-w-md">
              <p className="relative text-sm md:text-base font-bold italic text-accent leading-[1.9]">
                「素敵な空間だった、また来たい」
                <br />
                ——そう思っていただけることが、なによりの喜びです。
              </p>
              <div className="absolute -bottom-[9px] left-10 w-4 h-4 bg-cream border-b border-r border-accent/30 rotate-45" />
            </div>
          </FadeIn>

          <FadeIn delay={220}>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/25 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                  alt="坂本 将"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-navy tracking-widest">坂本 将</p>
                <p className="text-[11px] text-navy/40 tracking-[0.15em] uppercase mt-0.5">Founder &amp; Creative Director</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 右：写真コラージュ（大1枚＋小2枚） */}
        <FadeIn delay={100}>
          <div className="grid grid-cols-2 gap-4 h-[420px] md:h-[520px]">
            <div className="relative">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/about/concept-large.jpg"
                  alt="暖色の照明と彫刻"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* 装飾（ブラシストローク） */}
              <div className="absolute -bottom-12 -left-12 w-48 h-24 -rotate-6 pointer-events-none select-none">
                <Image src="/about/deco-brush2.png" alt="" fill className="object-contain" />
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src="/about/concept-small1.jpg"
                  alt="サンドウィッチ"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src="/about/concept-small2.jpg"
                  alt="窓辺に並ぶフィギュア"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
