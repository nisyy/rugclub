import type { Metadata } from 'next';
import Link from 'next/link';
import ShopHeading from '../_components/ShopHeading';
import DevNotice from '../_components/DevNotice';

export const metadata: Metadata = { title: 'ORDER', robots: { index: false } };

// 決済未接続のため、これは完了画面のレイアウト確認用プレビュー。
// 実際の注文番号・注文内容は、将来 Stripe Webhook で注文確定した後にサーバーから取得して表示する。
export default function CompletePage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Order" title="ORDER" bg="ORDER" />
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <DevNotice>これは完了画面のプレビューです。決済が未接続のため、実際に注文は行われていません。</DevNotice>
        <dl className="border-y border-navy/10 divide-y divide-navy/10 text-sm">
          <div className="flex gap-6 py-3"><dt className="w-32 shrink-0 text-navy/50">注文番号</dt><dd className="text-navy/40">未発行</dd></div>
          <div className="flex gap-6 py-3"><dt className="w-32 shrink-0 text-navy/50">注文商品</dt><dd className="text-navy/40">（注文確定後に表示）</dd></div>
          <div className="flex gap-6 py-3"><dt className="w-32 shrink-0 text-navy/50">商品小計</dt><dd className="text-navy/40">—</dd></div>
          <div className="flex gap-6 py-3"><dt className="w-32 shrink-0 text-navy/50">送料</dt><dd className="text-navy/40">—</dd></div>
          <div className="flex gap-6 py-3"><dt className="w-32 shrink-0 text-navy/50">合計金額</dt><dd className="text-navy/40">—</dd></div>
        </dl>
        <p className="mt-6 text-xs text-navy/50 leading-relaxed">ご注文確定後、ご登録のメールアドレスへ注文内容をご案内する予定です。</p>
        <div className="mt-10 text-center"><Link href="/shop" className="btn-pill">SHOPへ</Link></div>
      </div>
    </div>
  );
}
