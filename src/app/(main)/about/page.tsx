import Image from 'next/image';
import type { Metadata } from 'next';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeader from '@/components/ui/SectionHeader';
import CTAButton from '@/components/ui/CTAButton';

export const metadata: Metadata = {
  title: 'ABOUT',
  description: 'RUG CLUBのストーリーとコンセプト。日常と芸術表現の境界が溶け合う洗練された空間。',
};

// ─────────────────────────────────────────────
// 1. Hero
// ─────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative -mt-16 h-[56vh] min-h-[360px] flex items-end">
      <Image
        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200"
        alt="RUG CLUB カフェ店内"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none">
          ABOUT{' '}
          <span className="text-accent">RUG CLUB</span>
        </h1>
        <p className="eyebrow text-white/45 mt-4">Our Story &amp; Concept</p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. メインコンセプト  bg: white
// ─────────────────────────────────────────────
function MainConceptSection() {
  return (
    <section className="bg-navy section-pad">
      <FadeIn>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.3] mb-8">
            今日も、感性から
            <br />
            手づくりで仕込んで。
          </h2>
          <p className="text-sm text-charcoal/60 leading-[2] max-w-xl mx-auto">
            RUG CLUBは単なるカフェではありません。日常と芸術表現の境界が溶け合う、洗練された空間です。
            アートは静かなギャラリーの中だけに閉じ込められるべきではない、私たちはそう考えています。
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={120}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-16">
          <div className="relative aspect-[16/9] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200"
              alt="コーヒーを注ぐバリスタ"
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. 3カラム価値観  bg: cream
// ─────────────────────────────────────────────
const values = [
  {
    title: 'Concept',
    body: 'すべてのテーブルが現代の美の集合点をつくるための特別な場所を組み合わせて仕上げています。',
  },
  {
    title: 'Vision',
    body: '場所の哲学は本来の定義からくれているように、新しいアートのコミュニティで、新たなアートが自然に巡り日を感じています。',
  },
  {
    title: 'Craft',
    body: '厳選された主主、環境知識、すべてのスペースにアートを感じるべてリー、細部にきっとどうの行き届いた作業ものを提供します。',
  },
];

function ValuesSection() {
  return (
    <section className="bg-cream section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 120}>
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-charcoal tracking-widest">
                  {v.title}
                </h3>
                <div className="w-8 h-px bg-accent" />
                <p className="text-xs text-charcoal/60 leading-[2]">{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. 左右2分割：アート写真(左) + 深い緑テキスト(右)
// ─────────────────────────────────────────────
function SplitArtSection() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[480px] md:min-h-[580px] lg:min-h-[640px] overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200"
            alt="ギャラリーアート作品"
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
        </div>
        <div className="bg-forest flex items-center px-8 sm:px-12 lg:px-16 py-20">
          <FadeIn>
            <div className="max-w-md">
              <SectionHeader
                eyebrow="Art & Space"
                heading="アートを、もっと身近に。"
                body="RUG CLUBのバリスタ・キュレーターが、日常のひとときを少しだけ特別なものにします。毎日でも通えるように、余計なものは入れず、豆の個性と空間の余白を丁寧に仕込んでお待ちいたします。"
                theme="dark"
                className="mb-10"
              />
              <CTAButton href="/menu" variant="outline-light">LEARN MORE</CTAButton>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. 左右2分割逆：白テキスト(左) + コーヒー写真(右)
// ─────────────────────────────────────────────
function SplitCoffeeSection() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-navy flex items-center px-8 sm:px-12 lg:px-16 py-20 order-2 md:order-1">
          <FadeIn>
            <div className="max-w-md">
              <SectionHeader
                eyebrow="Coffee & Craft"
                heading="素材の味を、アートのように。"
                body="私たちの場所は、ただコーヒーを飲む場所ではなく、新しい関係に出会うためのキャンバスです。五感と魂を呼び覚ます、豆達の体験を楽しんでください。"
                className="mb-10"
              />
              <CTAButton href="/gallery" variant="outline">THE COLLECTION</CTAButton>
            </div>
          </FadeIn>
        </div>
        <div className="relative min-h-[480px] md:min-h-[580px] lg:min-h-[640px] order-1 md:order-2 overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800"
            alt="コーヒードリンク"
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. オーナーコメント  bg: cream
// ─────────────────────────────────────────────
function OwnerCommentSection() {
  return (
    <section className="bg-cream section-pad">
      <FadeIn>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <blockquote className="text-xl md:text-2xl font-bold italic text-charcoal leading-[1.9] mb-14">
            「コーヒーを飲む環境は、カフェインそのものと同じくらい
            <span className="text-accent">刺激的</span>
            であるべきだというシンプルな考えからRUG CLUBを設立しました。
            <span className="text-accent">五感と魂</span>
            を呼び覚ます場所でありたいのです。」
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/25 shrink-0">
              <Image
                src="https://placehold.co/100x100/d8c8b4/888888?text=S"
                alt="坂本 玲"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-charcoal tracking-widest">坂本 玲</p>
              <p className="eyebrow text-charcoal/40 mt-0.5">Founder &amp; Creative Director</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <MainConceptSection />
      <ValuesSection />
      <SplitArtSection />
      <SplitCoffeeSection />
      <OwnerCommentSection />
    </>
  );
}
