import { NextRequest, NextResponse } from 'next/server';
import { priceCart, sanitizeLines } from '@/lib/shop/pricing';
import { createCheckoutSession, isPaymentConnected, isStripeTestKey, siteOrigin } from '@/lib/shop/payment';
import { validateCustomer } from '@/lib/shop/validation';
import { attachStripeSession, createOrder, OutOfStockError, releaseOrder, updateOrderMail } from '@/lib/shop/orders';
import { sendOrderMails } from '@/lib/shop/orderMail';
import { isShopTestMode } from '@/lib/shop/testMode';
import type { Customer } from '@/lib/shop/types';

export const maxDuration = 60;

// 注文開始。ブラウザの価格・合計は一切信用せず、商品ID＋数量からサーバーで再計算する。
// ・Stripe接続時: 注文を「決済待ち」で保存して在庫を確保し、Stripe Checkout のURLを返す。
//   注文の確定（メール送信・売上計上）は Webhook(/api/shop/webhook) で行う。
// ・テストモード(SHOP_TEST_MODE=true)かつStripe未接続: 決済を通さず「テスト注文」として保存・メール送信まで行う。
export async function POST(req: NextRequest) {
  let body: { lines?: unknown; customer?: Partial<Customer>; idempotencyKey?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const customer: Customer = {
    name: String(body.customer?.name ?? ''),
    email: String(body.customer?.email ?? ''),
    postalCode: String(body.customer?.postalCode ?? ''),
    prefecture: String(body.customer?.prefecture ?? ''),
    city: String(body.customer?.city ?? ''),
    address2: String(body.customer?.address2 ?? ''),
  };
  const errors = validateCustomer(customer);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: 'invalid_customer', errors }, { status: 400 });
  }

  // 送料の地域判定は、送信された届け先の都道府県で行う
  const cart = await priceCart(sanitizeLines(body.lines), customer.prefecture);
  if (cart.lines.length === 0) {
    return NextResponse.json({ ok: false, error: 'empty_cart' }, { status: 400 });
  }
  if (cart.shippingYen === null) {
    return NextResponse.json({ ok: false, error: 'shipping_unset' }, { status: 409 });
  }

  // Stripeが未接続でテストモードの時だけ、決済を通さない簡易テスト注文にする。
  // Stripeのキー（sk_test_ を含む）が設定されていれば、テストモード中でも実際にStripe経由で決済する。
  if (isShopTestMode() && !isPaymentConnected()) {
    const key = typeof body.idempotencyKey === 'string' ? body.idempotencyKey : '';
    if (key.length < 8 || key.length > 100) {
      return NextResponse.json({ ok: false, error: 'invalid_idempotency_key' }, { status: 400 });
    }
    try {
      const { order, created } = await createOrder(key, cart, customer);
      if (created) {
        order.mail = await sendOrderMails(order);
        await updateOrderMail(order.id, order.mail).catch(() => {});
      }
      return NextResponse.json({
        ok: true,
        testOrder: {
          orderNumber: order.orderNumber,
          testMode: order.testMode,
          lines: order.lines,
          subtotalYen: order.subtotalYen,
          shippingYen: order.shippingYen,
          shippingProvisional: order.shippingProvisional,
          totalYen: order.totalYen,
          mailSent: order.mail.customer === 'sent',
        },
      });
    } catch (e) {
      if (e instanceof OutOfStockError) {
        return NextResponse.json({ ok: false, error: 'out_of_stock', name: e.productName }, { status: 409 });
      }
      console.error('[Shop] 注文作成失敗:', e instanceof Error ? e.message : e);
      return NextResponse.json({ ok: false, error: 'order_failed' }, { status: 500 });
    }
  }

  if (!isPaymentConnected()) {
    return NextResponse.json({ ok: false, error: 'payment_not_connected' }, { status: 501 });
  }

  // ── Stripe決済 ──
  if (cart.blockedReasons.length > 0) {
    return NextResponse.json({ ok: false, error: 'blocked', reasons: cart.blockedReasons }, { status: 409 });
  }
  const key = typeof body.idempotencyKey === 'string' ? body.idempotencyKey : '';
  if (key.length < 8 || key.length > 100) {
    return NextResponse.json({ ok: false, error: 'invalid_idempotency_key' }, { status: 400 });
  }
  const origin = siteOrigin(new URL(req.url).origin);
  let orderId: string | null = null;
  let created = false;
  try {
    // Stripeのテスト用キーでの取引は「テスト注文」として記録する
    const { order, created: isNew } = await createOrder(key, { ...cart, testMode: cart.testMode || isStripeTestKey() }, customer, { pending: true });
    orderId = order.id;
    created = isNew;
    // 同じキーでの再送は、作成済みの決済ページをそのまま返す（二重に注文・在庫確保しない）
    if (!isNew && order.stripeCheckoutUrl && order.status === 'pending_payment') {
      return NextResponse.json({ ok: true, redirectUrl: order.stripeCheckoutUrl, sessionId: order.stripeSessionId });
    }
    if (!isNew && order.status !== 'pending_payment') {
      return NextResponse.json({ ok: false, error: 'already_processed' }, { status: 409 });
    }
    const session = await createCheckoutSession(order, origin);
    await attachStripeSession(order.id, session.id, session.url);
    return NextResponse.json({ ok: true, redirectUrl: session.url, sessionId: session.id });
  } catch (e) {
    if (e instanceof OutOfStockError) {
      return NextResponse.json({ ok: false, error: 'out_of_stock', name: e.productName }, { status: 409 });
    }
    console.error('[Shop] 決済開始失敗:', e instanceof Error ? e.message : e);
    // 確保した在庫を戻す
    if (orderId && created) await releaseOrder(orderId).catch(() => {});
    return NextResponse.json({ ok: false, error: 'checkout_failed' }, { status: 502 });
  }
}
