import type { Metadata } from 'next';
import ContactForm from './_components/ContactForm';

export const metadata: Metadata = {
  title: 'CONTACT',
  description:
    'Cafe RUG CLUBへのお問い合わせはこちら。カフェ・スペースレンタル・展示についてお気軽にご連絡ください。',
};

// ─── Page header ──────────────────────────────
function PageHeader() {
  return (
    <div className="mb-14">
      <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">
        Get in Touch
      </p>
      <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label mb-4">
        CONTACT
      </h1>
      <p className="text-sm text-navy/50">
        お問い合わせ内容をご入力ください。
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────
export default function ContactPage() {
  return (
    <section className="relative bg-cream min-h-screen pb-16 lg:pb-20 pt-24 lg:pt-28 overflow-hidden">
      {/* 背景大テキスト */}
      <div className="absolute inset-0 flex items-start pt-0 pointer-events-none select-none" aria-hidden="true">
        <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">
          CONTACT
        </span>
      </div>
      <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-8">
        <PageHeader />
        <ContactForm />
      </div>
    </section>
  );
}
