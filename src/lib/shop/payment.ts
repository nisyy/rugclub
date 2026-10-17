import Stripe from 'stripe';
import type { OrderRecord } from './types';

// ─────────────────────────────────────────────
// 決済境界（Stripe Checkout）。画面・APIはこのモジュールだけを通して決済を行う。
//  - 秘密鍵はサーバーの環境変数 STRIPE_SECRET_KEY のみ（ブラウザには出さない）
//  - 金額は、サーバーで再計算して保存した注文(OrderRecord)の値だけを使う
//  - 注文の確定は Webhook（/api/shop/webhook）で行う。Webhookの署名検証とイベントID重複排除は必須
// ─────────────────────────────────────────────

export function isPaymentConnected(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/** テスト用キー(sk_test_)の取引は「テスト注文」として扱う（集計・計測から除外） */
export function isStripeTestKey(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_');
}

let client: Stripe | null = null;
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY が設定されていません');
  if (!client) {
    client = new Stripe(key, {
      // 自動テスト用: 擬似Stripeサーバーへ向ける場合のみ指定（通常は未設定）
      ...(process.env.STRIPE_API_HOST
        ? { host: process.env.STRIPE_API_HOST, port: process.env.STRIPE_API_PORT, protocol: (process.env.STRIPE_API_PROTOCOL as 'http' | 'https') ?? 'https' }
        : {}),
    });
  }
  return client;
}

/** 決済後に戻ってくるサイトのURL。本番は環境変数（未設定なら公式ドメイン）、開発はアクセス元 */
export function siteOrigin(requestOrigin: string): string {
  if (process.env.NODE_ENV === 'production') return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rug-club.net').replace(/\/$/, '');
  return requestOrigin;
}

export const CHECKOUT_EXPIRES_MIN = 31; // Stripeの最短は30分。この間は在庫を確保する

/** 注文から Stripe Checkout セッションを作る（冪等キー＝注文ID） */
export async function createCheckoutSession(order: OrderRecord, origin: string): Promise<{ id: string; url: string }> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.lines.map((l) => ({
    quantity: l.qty,
    price_data: { currency: 'jpy', unit_amount: l.unitPriceYen, product_data: { name: l.name } },
  }));
  if (order.shippingYen > 0) {
    lineItems.push({ quantity: 1, price_data: { currency: 'jpy', unit_amount: order.shippingYen, product_data: { name: '送料' } } });
  }

  const session = await getStripe().checkout.sessions.create(
    {
      mode: 'payment',
      allowed_payment_method_types: ['card'],
      locale: 'ja',
      customer_email: order.customer.email,
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      payment_intent_data: { description: `RUG CLUB ${order.orderNumber}`, metadata: { orderId: order.id, orderNumber: order.orderNumber } },
      line_items: lineItems,
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRES_MIN * 60,
      success_url: `${origin}/shop/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/checkout?canceled=1`,
    },
    { idempotencyKey: `checkout-${order.id}` },
  );
  if (!session.url) throw new Error('Stripe checkout URL が取得できません');
  return { id: session.id, url: session.url };
}
