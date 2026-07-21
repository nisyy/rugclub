import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import PillArrowLink from './PillArrowLink';

const PREVIEW_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600', alt: '店内の様子' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', alt: 'コーヒー' },
  { src: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600', alt: 'サンドウィッチ' },
  { src: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600', alt: '店内の席' },
];

export default function GallerySection() {
  return (
    <section className="bg-cream section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <MaskRevealHeading
            as="h2"
            className="font-display text-navy text-2xl md:text-4xl leading-none"
          >
            Gallery
          </MaskRevealHeading>
          <FadeIn>
            <PillArrowLink href="/gallery">ギャラリーを見る</PillArrowLink>
          </FadeIn>
        </div>

        <FadeIn delay={80}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PREVIEW_IMAGES.map((img) => (
              <div key={img.src} className="relative aspect-square rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
