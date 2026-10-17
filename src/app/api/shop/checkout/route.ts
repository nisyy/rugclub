import { NextRequest, NextResponse } from 'next/server';
import { priceCart, sanitizeLines } from '@/lib/shop/pricing';
import { startCheckout } from '@/lib/shop/payment';
import { validateCustomer } from '@/lib/shop/validation';
import { createOrder, OutOfStockError, updateOrderMail } from '@/lib/shop/orders';
import { sendOrderMails } from '@/lib/shop/orderMail';
import { isShopTestMode } from '@/lib/shop/testMode';
import type { Customer } from '@/lib/shop/types';

export const maxDuration = 60;

// 注文開始。ブラウザの価格・合計は一切信用せず、商品ID＋数量からサーバーで再計算する。
// ・通常: 決済(payment.ts)へ。現状は未接続なので 501。注文確定は将来 Stripe Webhook 側で行う。
// ・テストモード(SHOP_TEST_MODE=true): 「テスト注文」として保存・在庫引き当て・メール送信まで行う。
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

  const cart = await priceCart(sanitizeLines(body.lines));
  if (cart.lines.length === 0) {
    return NextResponse.json({ ok: false, error: 'empty_cart' }, { status: 400 });
  }
  if (cart.shippingYen === null) {
    return NextResponse.json({ ok: false, error: 'shipping_unset' }, { status: 409 });
  }

  if (isShopTestMode()) {
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

  const result = await startCheckout(cart, customer);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 501 });
  }
  return NextResponse.json({ ok: true, redirectUrl: result.redirectUrl });
}
