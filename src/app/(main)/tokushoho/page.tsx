import type { Metadata } from 'next';
import { getLegalSettings, LEGAL_LABELS, missingLegalFields } from '@/lib/shop/legal';
import { getShippingSettings } from '@/lib/shop/shipping';
import { formatYen } from '@/lib/shop/format';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | RUG CLUB',
};

export const revalidate = 60;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-8 py-5 border-b border-navy/10">
      <dt className="sm:w-48 shrink-0 text-xs font-semibold tracking-wide text-navy/50">{label}</dt>
      <dd className="text-sm text-navy leading-relaxed whitespace-pre-wrap flex-1">{children}</dd>
    </div>
  );
}

export default async function TokushohoPage() {
  const [l, ship] = await Promise.all([getLegalSettings(), getShippingSettings()]);
  const missing = new Set(missingLegalFields(l));
  const v = (k: keyof typeof l) => (missing.has(k) ? <span className="text-navy/40">（準備中）</span> : l[k]);

  const shippingText =
    ship.flatFeeYen === null
      ? '（準備中）'
      : [
          `${formatYen(ship.flatFeeYen)}（北海道・沖縄を除く）`,
          ship.remoteFeeYen !== null && ship.remoteFeeYen !== ship.flatFeeYen ? `${formatYen(ship.remoteFeeYen)}（北海道・沖縄）` : null,
          ship.freeThresholdYen !== null ? `商品代金（税込）の合計が${formatYen(ship.freeThresholdYen)}以上の場合は送料無料` : null,
        ].filter(Boolean).join('\n');

  return (
    <main className="bg-cream min-h-screen pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">Legal</p>
          <h1 className="font-display text-navy text-xl sm:text-2xl tracking-[0.15em]">特定商取引法に基づく表記</h1>
        </div>
        <dl className="border-t border-navy/10">
          <Row label={LEGAL_LABELS.sellerName}>{v('sellerName')}</Row>
          <Row label={LEGAL_LABELS.representative}>{v('representative')}</Row>
          <Row label={LEGAL_LABELS.address}>{v('address')}</Row>
          <Row label={LEGAL_LABELS.phone}>{v('phone')}</Row>
          <Row label={LEGAL_LABELS.email}>{v('email')}</Row>
          <Row label="販売価格">各商品ページに税込価格で表示しています。</Row>
          <Row label="商品代金以外の必要料金">送料：{shippingText}</Row>
          <Row label={LEGAL_LABELS.paymentMethod}>{v('paymentMethod')}</Row>
          <Row label={LEGAL_LABELS.paymentTiming}>{v('paymentTiming')}</Row>
          <Row label={LEGAL_LABELS.deliveryTime}>{v('deliveryTime')}</Row>
          <Row label={LEGAL_LABELS.returnPolicy}>{v('returnPolicy')}</Row>
          {l.note && <Row label={LEGAL_LABELS.note}>{l.note}</Row>}
        </dl>
      </div>
    </main>
  );
}
