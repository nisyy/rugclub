import { NextRequest, NextResponse } from 'next/server';
import { priceCart, sanitizeLines } from '@/lib/shop/pricing';
import { startCheckout } from '@/lib/shop/payment';
import { validateCustomer } from '@/lib/shop/validation';
import type { Customer } from '@/lib/shop/types';

// 決済開始。ブラウザの価格・合計は一切信用せず、商品ID＋数量からサーバーで再計算する。
// 注文確定（保存・在庫引き当て）はここでは行わない。将来は Stripe Webhook 側で実施する。
export async function POST(req: NextRequest) {
  let body: { lines?: unknown; customer?: Partial<Customer> };
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

  const result = await startCheckout(cart, customer);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 501 });
  }
  return NextResponse.json({ ok: true, redirectUrl: result.redirectUrl });
}
