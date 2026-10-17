'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/shop/CartProvider';
import { formatYen } from '@/lib/shop/format';
import { trackShop } from '@/lib/analytics';
import DevNotice from '../_components/DevNotice';

interface OrderView {
  orderNumber: string;
  testMode?: boolean;
  lines: { id: string; name: string; qty: number; lineTotalYen: number }[];
  subtotalYen: number;
  shippingYen: number;
  shippingProvisional?: boolean;
  totalYen: number;
  mailSent: boolean;
}

type Phase = 'checking' | 'paid' | 'unpaid' | 'timeout' | 'error' | 'preview';

const POLL_MS = 2000;
const POLL_MAX = 15;

// 完了画面。
//  ・Stripe決済から戻った場合（?session_id=）: 決済の確認が取れた注文だけを「ご注文完了」として表示する。
//    Webhookの反映を待つため数秒間確認を繰り返す。確認できない間は「完了」とは表示しない。
//  ・テスト注文（決済を通さない）: 保存済みの注文内容を表示する。
//  ・どちらでもない場合: 注文番号「未発行」のプレビュー表示。
export default function CompleteView() {
  const sessionId = useSearchParams().get('session_id');
  const { clear } = useCart();
  const [order, setOrder] = useState<OrderView | null>(null);
  const [phase, setPhase] = useState<Phase>(sessionId ? 'checking' : 'preview');
  const started = useRef(false);

  function onPaid(o: OrderView) {
    setOrder(o);
    setPhase('paid');
    clear();
    sessionStorage.removeItem('rugclub_pending_session');
    // 実注文のみ purchase を送る（テスト注文は数字に混ぜない）。再読込で二重に送らない
    if (!o.testMode && sessionStorage.getItem('rugclub_purchase_logged') !== o.orderNumber) {
      sessionStorage.setItem('rugclub_purchase_logged', o.orderNumber);
      trackShop('purchase', o.lines.map((l) => ({ id: l.id, name: l.name, price: Math.round(l.lineTotalYen / l.qty), quantity: l.qty })), { transactionId: o.orderNumber, shipping: o.shippingYen });
    }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!sessionId) {
      // 決済を通さないテスト注文の完了表示
      try {
        const raw = sessionStorage.getItem('rugclub_last_order');
        if (raw) {
          const o = JSON.parse(raw) as OrderView;
          setOrder(o);
          setPhase('paid');
          if (!o.testMode && sessionStorage.getItem('rugclub_purchase_logged') !== o.orderNumber) {
            sessionStorage.setItem('rugclub_purchase_logged', o.orderNumber);
            trackShop('purchase', o.lines.map((l) => ({ id: l.id, name: l.name, price: Math.round(l.lineTotalYen / l.qty), quantity: l.qty })), { transactionId: o.orderNumber, shipping: o.shippingYen });
          }
        }
      } catch {}
      return;
    }

    let cancelled = false;
    (async () => {
      for (let i = 0; i < POLL_MAX && !cancelled; i++) {
        try {
          const res = await fetch(`/api/shop/order-status?session_id=${encodeURIComponent(sessionId)}`);
          if (res.status === 404 || res.status === 400) { setPhase('error'); return; }
          const data = (await res.json()) as { ok: boolean; status?: string; paid?: boolean; order?: OrderView };
          if (data.ok && data.paid && data.order) { onPaid(data.order); return; }
          if (data.ok && data.status === 'canceled') { setPhase('unpaid'); return; }
        } catch {}
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
      if (!cancelled) setPhase('timeout');
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const row = 'flex gap-6 py-3';
  const dt = 'w-32 shrink-0 text-navy/50';

  if (phase === 'checking') {
    return (
      <div role="status" aria-live="polite" className="py-20 text-center">
        <svg className="mx-auto animate-spin text-orange" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
        <p className="mt-6 font-display text-navy text-lg tracking-[0.15em]">お支払いを確認しています</p>
        <p className="mt-3 text-sm text-navy/60">そのままお待ちください。画面を閉じないでください。</p>
      </div>
    );
  }

  if (phase === 'timeout' || phase === 'error' || phase === 'unpaid') {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-navy text-lg tracking-[0.1em]">
          {phase === 'unpaid' ? 'お支払いが完了していません' : phase === 'error' ? '注文情報を確認できませんでした' : 'お支払いの確認に時間がかかっています'}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-navy/60">
          {phase === 'unpaid' && 'この注文はキャンセルされました。お手数ですが、あらためてご注文ください。'}
          {phase === 'timeout' && '決済が完了している場合は、ご入力のメールアドレスに注文確認メールが届きます。しばらくしても届かない場合は、お問い合わせください。二重にお支払いしないようご注意ください。'}
          {phase === 'error' && 'この画面のURLが正しくない可能性があります。ご不明な点はお問い合わせください。'}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href="/contact?subject=shop" className="btn-pill">お問い合わせ</Link>
          <Link href="/shop" className="text-xs text-navy/50 underline underline-offset-2">SHOPへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {order?.testMode ? (
        <DevNotice>これはテスト注文です。実際の決済は行われておらず、商品は発送されません。</DevNotice>
      ) : !order ? (
        <DevNotice>これは完了画面のプレビューです。実際に注文は行われていません。</DevNotice>
      ) : (
        <div role="status" className="mb-8 rounded-lg border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ご注文ありがとうございます。お支払いが完了し、ご注文を受け付けました。
        </div>
      )}
      <dl className="border-y border-navy/10 divide-y divide-navy/10 text-sm">
        <div className={row}><dt className={dt}>注文番号</dt><dd className={order ? 'text-navy font-bold' : 'text-navy/40'}>{order ? order.orderNumber : '未発行'}</dd></div>
        <div className={row}><dt className={dt}>注文商品</dt><dd className="text-navy/70 space-y-1">{order ? order.lines.map((l) => <p key={l.id}>{l.name} × {l.qty}　{formatYen(l.lineTotalYen)}</p>) : <span className="text-navy/40">（注文確定後に表示）</span>}</dd></div>
        <div className={row}><dt className={dt}>商品小計</dt><dd className="text-navy/70">{order ? formatYen(order.subtotalYen) : '—'}</dd></div>
        <div className={row}><dt className={dt}>送料</dt><dd className="text-navy/70">{order ? `${formatYen(order.shippingYen)}${order.shippingProvisional ? '（テスト用の仮送料）' : ''}` : '—'}</dd></div>
        <div className={row}><dt className={dt}>合計金額</dt><dd className="text-navy font-bold">{order ? formatYen(order.totalYen) : '—'}</dd></div>
      </dl>
      <p className="mt-6 text-xs text-navy/50 leading-relaxed">
        {order
          ? order.mailSent ? 'ご入力のメールアドレスへ、注文内容をお送りしました。' : '注文確認メールをお送りします。届かない場合は、お問い合わせください。'
          : 'ご注文確定後、ご登録のメールアドレスへ注文内容をご案内する予定です。'}
      </p>
      <div className="mt-10 text-center"><Link href="/shop" className="btn-pill">SHOPへ</Link></div>
    </>
  );
}
