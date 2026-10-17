import Image from 'next/image';

export default function ProductImage({ src, alt, sizes }: { src: string | null; alt: string; sizes: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-md bg-navy/5">
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.3em] text-navy/30 font-display uppercase">
          No Image
        </div>
      )}
    </div>
  );
}
