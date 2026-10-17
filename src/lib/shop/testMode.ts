// テストモード: 環境変数 SHOP_TEST_MODE=true の時だけ有効。
// 送料未確定のブロックを外し、決済(Stripe)を通さず「テスト注文」として注文確定・メール送信まで通せる。
// 事故防止: 本番(sk_live_)のStripeキーが設定されている場合は、フラグが立っていても無効にする。
export function isShopTestMode(): boolean {
  if ((process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_live_')) return false;
  return process.env.SHOP_TEST_MODE === 'true';
}

/** テストモード中だけ使う仮送料（円）。正式な送料ルールではない */
export const TEST_SHIPPING_YEN = 500;
