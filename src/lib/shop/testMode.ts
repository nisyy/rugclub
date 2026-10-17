// テストモード: 環境変数 SHOP_TEST_MODE=true の時だけ有効。
// 送料未確定・決済未接続のブロックを外し、「テスト注文」として注文確定・メール送信まで通せる。
// 本番公開時は必ず未設定（または false）にすること。
export function isShopTestMode(): boolean {
  return process.env.SHOP_TEST_MODE === 'true';
}

/** テストモード中だけ使う仮送料（円）。正式な送料ルールではない */
export const TEST_SHIPPING_YEN = 500;
