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
    <div className="text-center mb-14">
      <h1 className="text-6xl sm:text-7xl font-bold text-navy tracking-widest mb-4">
        CONTACT
      </h1>
      <p className="text-sm text-navy/50 mb-6">
        お問い合わせ内容をご入力ください。
      </p>
      {/* 短い横線 */}
      <div className="w-10 h-px bg-navy/20 mx-auto" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────
export default function ContactPage() {
  return (
    <section className="bg-cream min-h-screen pb-16 lg:pb-20 pt-12 lg:pt-16">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <PageHeader />
        <ContactForm />
      </div>
    </section>
  );
}
