'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatYen } from '@/lib/shop/format';
import DevNotice from '../_components/DevNotice';

interface TestOrder {
  orderNumber: string;
  lines: { id: string; name: string; qty: number; lineTotalYen: number }[];
  subtotalYen: number;
  shippingYen: number;
  totalYen: number;
  mailSent: boolean;
}

// 完了画面。サーバーが注文を保存した場合（テスト注文）だけ、その内容を表示する。
// 注文情報がない状態で開いた場合は、注文番号「未発行」のプレビューとして表示し、購入完了とは表示しない。
export default function CompleteView() {
  const [order, setOrder] = useState<TestOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('rugclub_last_order');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOrder(JSON.parse(raw) as TestOrder);
    } catch {}
  }, []);

  const row = 'flex gap-6 py-3';
  const dt = 'w-32 shrink-0 text-navy/50';

  return (
    <>
      <DevNotice>
        {order
          ? 'これはテスト注文です。決済は行われておらず、商品は発送されません。'
          : 'これは完了画面のプレビューです。実際に注文は行われていません。'}
      </DevNotice>
      <dl className="border-y border-navy/10 divide-y divide-navy/10 text-sm">
        <div className={row}><dt className={dt}>注文番号</dt><dd className={order ? 'text-navy font-bold' : 'text-navy/40'}>{order ? order.orderNumber : '未発行'}</dd></div>
        <div className={row}><dt className={dt}>注文商品</dt><dd className="text-navy/70 space-y-1">{order ? order.lines.map((l) => <p key={l.id}>{l.name} × {l.qty}　{formatYen(l.lineTotalYen)}</p>) : <span className="text-navy/40">（注文確定後に表示）</span>}</dd></div>
        <div className={row}><dt className={dt}>商品小計</dt><dd className="text-navy/70">{order ? formatYen(order.subtotalYen) : '—'}</dd></div>
        <div className={row}><dt className={dt}>送料</dt><dd className="text-navy/70">{order ? `${formatYen(order.shippingYen)}（テスト用の仮送料）` : '—'}</dd></div>
        <div className={row}><dt className={dt}>合計金額</dt><dd className="text-navy font-bold">{order ? formatYen(order.totalYen) : '—'}</dd></div>
      </dl>
      <p className="mt-6 text-xs text-navy/50 leading-relaxed">
        {order
          ? order.mailSent ? 'ご入力のメールアドレスへ、注文内容をお送りしました。' : '注文内容のメール送信に失敗した可能性があります。店舗側の注文管理でご確認ください。'
          : 'ご注文確定後、ご登録のメールアドレスへ注文内容をご案内する予定です。'}
      </p>
      <div className="mt-10 text-center"><Link href="/shop" className="btn-pill">SHOPへ</Link></div>
    </>
  );
}
