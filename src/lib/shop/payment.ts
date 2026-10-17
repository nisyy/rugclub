import type { Customer, PricedCart } from './types';

// ─────────────────────────────────────────────
// 決済境界。画面・APIはこのモジュールだけを通して決済を開始する。
// Stripe 接続時の差し替えポイント:
//  1. isPaymentConnected() を実接続判定（STRIPE_SECRET_KEY の有無など）にする
//  2. startCheckout() で Checkout Session を作成し、リダイレクトURLを返す
//     （金額は cart＝サーバー再計算済みの値のみ使用。秘密鍵はサーバー専用の環境変数）
//  3. 注文確定は Webhook（/api/shop/webhook 予定）で行う。署名検証とイベントID冪等処理が必須
// ─────────────────────────────────────────────

export function isPaymentConnected(): boolean {
  return false;
}

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; reason: 'payment_not_connected' };

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function startCheckout(
  _cart: PricedCart,
  _customer: Customer,
): Promise<CheckoutResult> {
  if (!isPaymentConnected()) return { ok: false, reason: 'payment_not_connected' };
  return { ok: false, reason: 'payment_not_connected' };
}
