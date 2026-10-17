import { TEST_SHIPPING_YEN } from './testMode';

// 送料計算の純粋関数（Firestore等に依存しない）
export interface ShippingSettings {
  /** 基本送料（円・北海道/沖縄以外）。null＝未設定 */
  flatFeeYen: number | null;
  /** 北海道・沖縄の送料（円）。null＝基本送料と同じ */
  remoteFeeYen: number | null;
  /** この小計（税込）以上で送料無料。null＝無料設定なし */
  freeThresholdYen: number | null;
}

export const REMOTE_PREFECTURES = ['北海道', '沖縄県'];

/**
 * 送料を決める。yen が null の間は注文を確定できない（テストモード時のみ仮送料）。
 * prefecture が未入力のカート段階では一般地域の送料を返し、北海道・沖縄が異なる場合は remoteYen で案内する。
 * 送料無料の条件金額は全地域共通。
 */
export function computeShipping(
  s: ShippingSettings,
  subtotalYen: number,
  prefecture: string | undefined,
  testMode: boolean,
): { yen: number | null; provisional: boolean; remoteYen: number | null; freeRemainingYen: number | null } {
  if (s.flatFeeYen === null) {
    return testMode ? { yen: TEST_SHIPPING_YEN, provisional: true, remoteYen: null, freeRemainingYen: null } : { yen: null, provisional: false, remoteYen: null, freeRemainingYen: null };
  }
  const free = s.freeThresholdYen !== null && subtotalYen >= s.freeThresholdYen;
  const isRemote = !!prefecture && REMOTE_PREFECTURES.includes(prefecture);
  const base = isRemote && s.remoteFeeYen !== null ? s.remoteFeeYen : s.flatFeeYen;
  const remoteYen = s.remoteFeeYen !== null && s.remoteFeeYen !== s.flatFeeYen && !free && !prefecture ? s.remoteFeeYen : null;
  const freeRemainingYen = s.freeThresholdYen !== null && !free ? s.freeThresholdYen - subtotalYen : null;
  return { yen: free ? 0 : base, provisional: false, remoteYen, freeRemainingYen };
}

