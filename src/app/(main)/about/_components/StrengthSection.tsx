import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import VerticalLabel from './VerticalLabel';

export default function StrengthSection() {
  return (
    <section className="relative bg-cream section-pad overflow-hidden">
      <VerticalLabel className="text-navy/10">03 — Strength</VerticalLabel>
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
          <p className="text-base md:text-lg font-bold italic text-accent leading-[1.9]">
            「素敵な空間だった、また来たい」——そう思っていただけることが、なによりの喜びです。
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
