// 送料ルールは未確定。確定したらここだけ差し替える（地域別・金額別などもこの関数内で表現）。
// null を返す間は、購入手続きの最終ボタンは無効のままになる。
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function getShippingFeeYen(_subtotalYen: number): number | null {
  return null;
}
