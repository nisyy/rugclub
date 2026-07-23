import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';
import MaskRevealHeading from './MaskRevealHeading';
import PillArrowLink from './PillArrowLink';
import { getGalleryItems } from '@/lib/notion';
import { DEMO_GALLERY } from '@/lib/demoData';

const FALLBACK = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800';

export default async function GallerySection() {
  const notionItems = await getGalleryItems();
  const items = (notionItems.length > 0 ? notionItems : DEMO_GALLERY).slice(0, 4);

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
            {items.map((item) => (
              <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={item.imageUrl || FALLBACK}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
