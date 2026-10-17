import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { confirmPayment, findOrderBySessionId, updateOrderMail } from '@/lib/shop/orders';
import { sendOrderMails } from '@/lib/shop/orderMail';
import { getStripe, isPaymentConnected } from '@/lib/shop/payment';

export const maxDuration = 60;

// 決済完了画面からの注文状況の確認。session_id（推測できないID）に紐づく注文の概要だけを返す。
// Webhookが遅れている場合に備え、決済待ちならStripeに直接確認して確定する（確定処理は冪等）。
export async function GET(req: NextRequest) {
  const rl = rateLimit(`order-status:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } });

  const sessionId = new URL(req.url).searchParams.get('session_id') ?? '';
  if (!/^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId)) return NextResponse.json({ ok: false, error: 'invalid_session' }, { status: 400 });

  try {
    let order = await findOrderBySessionId(sessionId);
    if (!order) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });

    if (order.status === 'pending_payment' && isPaymentConnected()) {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
        const r = await confirmPayment(order.id, {
          sessionId,
          amountTotal: session.amount_total,
          paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
        });
        order = r.order;
        if (r.transitioned) {
          order.mail = await sendOrderMails(order);
          await updateOrderMail(order.id, order.mail).catch(() => {});
        }
      }
    }

    return NextResponse.json({
      ok: true,
      status: order.status,
      paid: order.status !== 'pending_payment' && order.status !== 'canceled',
      order: {
        orderNumber: order.orderNumber,
        testMode: order.testMode,
        lines: order.lines.map((l) => ({ id: l.id, name: l.name, qty: l.qty, lineTotalYen: l.lineTotalYen })),
        subtotalYen: order.subtotalYen,
        shippingYen: order.shippingYen,
        totalYen: order.totalYen,
        mailSent: order.mail.customer === 'sent',
      },
    });
  } catch (e) {
    console.error('[Shop] 注文状況の確認に失敗:', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: 'lookup_failed' }, { status: 502 });
  }
}
