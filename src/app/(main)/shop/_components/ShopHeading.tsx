export default function ShopHeading({ eyebrow, title, bg }: { eyebrow: string; title: string; bg: string }) {
  return (
    <section className="relative pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden">
      <div className="absolute inset-0 flex items-start pointer-events-none select-none" aria-hidden="true">
        <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">{bg}</span>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
        <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">{eyebrow}</p>
        <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label">{title}</h1>
      </div>
    </section>
  );
}
