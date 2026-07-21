import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import VerticalLabel from './VerticalLabel';

export default function StrengthSection() {
  return (
    <section className="relative bg-cream section-pad overflow-hidden">
      <VerticalLabel className="text-navy/10">Strength</VerticalLabel>
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <MaskRevealHeading
          as="h2"
          className="font-display text-navy text-2xl md:text-4xl leading-[1.3] mb-10"
        >
          常に、
          <br />
          アートを感じられる場所。
        </MaskRevealHeading>

        <FadeIn>
          <p className="text-sm text-navy/70 leading-[2.1] mb-10">
            ギャラリーカフェという業態は、そう珍しいものではありません。だからこそ気負うことなく、これまで培ってきたアートの知識を活かせる場所として、コーヒーとアートを組み合わせました。家具はひとつひとつ、自分たちの目で選んだ60年代からのヴィンテージ。店内には20点ほどの作品を展示し、料理を待つ時間はスマホではなくアートを眺めて過ごす、そんなひとときも大切にしています。
          </p>
        </FadeIn>

        <FadeIn delay={120}>
          <p className="text-base md:text-lg font-bold italic text-accent leading-[1.9] mb-8">
            「素敵な空間だった、また来たい」——そう思っていただけることが、なによりの喜びです。
          </p>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/25 shrink-0 bg-cream">
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width="56" height="56" role="img" aria-label="坂本 将">
                <circle cx="28" cy="28" r="28" fill="#F0E6D2" />
                <path d="M28 31c6.5 0 10.5-5.2 10.5-11.5S34.5 8 28 8s-10.5 4.2-10.5 11.5S21.5 31 28 31z" fill="#D9A575" />
                <path d="M14.8 19.5c0-7.5 5.9-13 13.2-13s13.2 5.5 13.2 13c0-1.2.3-2.6.3-4C41.5 8 35.4 3 28 3S14.5 8 14.5 15.5c0 1.4.3 2.8.3 4z" fill="#1A2535" />
                <path d="M9 56c1-11.5 8.5-20 19-20s18 8.5 19 20H9z" fill="#1A2535" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-navy tracking-widest">坂本 将</p>
              <p className="text-[11px] text-navy/40 tracking-[0.15em] uppercase mt-0.5">Founder &amp; Creative Director</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
