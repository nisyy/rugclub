import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getStripe } from '@/lib/shop/payment';
import { confirmPayment, releaseOrder, updateOrderMail } from '@/lib/shop/orders';
import { sendOrderMails } from '@/lib/shop/orderMail';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Stripe Webhook。
//  1. 署名を検証（偽のリクエストを拒否）
//  2. イベントIDで重複排除（Stripeは同じイベントを複数回送ることがある）
//  3. checkout.session.completed → 注文を確定（メール送信）／ checkout.session.expired → 在庫を戻して取り消し
// 失敗時は 500 を返し、Stripe に再送させる（最大3日間）。
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'not_configured' }, { status: 400 });
  }

  const raw = await req.text(); // 署名検証には生のボディが必要
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    console.error('[Shop webhook] 署名検証に失敗:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });

  // 重複排除: イベントIDのドキュメントを作成できた1回だけ処理する
  const lock = db.collection('shop_stripe_events').doc(event.id);
  try {
    await lock.create({ type: event.type, receivedAt: new Date().toISOString() });
  } catch (e) {
    if ((e as { code?: number }).code === 6) return NextResponse.json({ ok: true, duplicate: true }); // ALREADY_EXISTS
    console.error('[Shop webhook] 重複排除の記録に失敗:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'lock_failed' }, { status: 500 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id ?? session.metadata?.orderId;
      // カードは即時決済のため paid。未払い（非同期決済など）の場合は確定しない
      if (orderId && session.payment_status === 'paid') {
        const { order, transitioned } = await confirmPayment(orderId, {
          sessionId: session.id,
          amountTotal: session.amount_total,
          paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
        });
        if (transitioned) {
          const mail = await sendOrderMails(order);
          await updateOrderMail(order.id, mail).catch(() => {});
        }
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id ?? session.metadata?.orderId;
      if (orderId) await releaseOrder(orderId);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[Shop webhook] 処理に失敗（再送を依頼）:', event.type, e instanceof Error ? e.message : e);
    await lock.delete().catch(() => {}); // 再送時に処理できるよう記録を消す
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }
}
