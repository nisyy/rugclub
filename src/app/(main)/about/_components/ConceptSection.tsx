import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import VerticalLabel from './VerticalLabel';

export default function ConceptSection() {
  return (
    <section className="relative bg-cream section-pad overflow-hidden">
      <VerticalLabel className="text-navy/10">01 — Story</VerticalLabel>
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <MaskRevealHeading
          as="h2"
          className="font-display text-navy text-3xl md:text-5xl leading-[1.3] mb-10"
        >
          身近に、
          <br />
          アートを感じる場所。
        </MaskRevealHeading>

        <FadeIn>
          <p className="text-sm text-navy/70 leading-[2.1] mb-8">
            「将来カフェなんかできたらいいよなぁ」。中学のラグビー部の仲間と交わした、なにげないひとことが原点です。RUG
            CLUBという名前には、その頃の記憶が込められています。
          </p>
        </FadeIn>

        <FadeIn delay={120}>
          <p className="text-sm text-navy/70 leading-[2.1]">
            学生時代から絵を描くことが好きで、美術を学び、かつては美術教師として教壇に立っていました。私にとってアートは特別なものではなく、日常の隣にあるもの。ふらりと立ち寄った古本屋で見つけた一冊の画集や、色褪せた雑誌の表紙。そんな些細な出会いが、今でも心を動かしてくれます。
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
