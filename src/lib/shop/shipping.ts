import { getAdminDb } from '@/lib/firebaseAdmin';
import { isShopTestMode, TEST_SHIPPING_YEN } from './testMode';

// 送料設定は管理画面で編集し、Firestore（shop_settings/shipping）に保存する。
// 地域別などルールを増やす場合は、この resolveShipping の中だけを拡張する。
export interface ShippingSettings {
  /** 基本送料（円）。null＝未設定 */
  flatFeeYen: number | null;
  /** この小計（税込）以上で送料無料。null＝無料設定なし */
  freeThresholdYen: number | null;
}

const DOC = ['shop_settings', 'shipping'] as const;

export async function getShippingSettings(): Promise<ShippingSettings> {
  const db = getAdminDb();
  if (db) {
    try {
      const snap = await db.collection(DOC[0]).doc(DOC[1]).get();
      const d = snap.data();
      if (d) {
        return {
          flatFeeYen: Number.isInteger(d.flatFeeYen) ? d.flatFeeYen : null,
          freeThresholdYen: Number.isInteger(d.freeThresholdYen) ? d.freeThresholdYen : null,
        };
      }
    } catch (e) {
      console.error('[shop shipping] 読み込み失敗:', e instanceof Error ? e.message : e);
    }
  }
  return { flatFeeYen: null, freeThresholdYen: null };
}

export function parseShippingSettings(raw: unknown): ShippingSettings | string {
  const r = (raw ?? {}) as Record<string, unknown>;
  const num = (v: unknown, label: string): number | null | string => {
    if (v === null || v === '' || v === undefined) return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n > 1_000_000) return `${label}は0以上の整数（円）で入力するか、空欄にしてください`;
    return n;
  };
  const flat = num(r.flatFeeYen, '基本送料');
  if (typeof flat === 'string') return flat;
  const free = num(r.freeThresholdYen, '送料無料の条件金額');
  if (typeof free === 'string') return free;
  return { flatFeeYen: flat, freeThresholdYen: free };
}

export async function saveShippingSettings(s: ShippingSettings): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error('Firestoreに接続できません（FIREBASE_* 環境変数を確認してください）');
  await db.collection(DOC[0]).doc(DOC[1]).set({ ...s, updatedAt: new Date().toISOString() });
}

/** 送料を決める。yen が null の間は注文を確定できない（テストモード時のみ仮送料） */
export async function resolveShipping(subtotalYen: number): Promise<{ yen: number | null; provisional: boolean }> {
  const s = await getShippingSettings();
  if (s.flatFeeYen !== null) {
    const free = s.freeThresholdYen !== null && subtotalYen >= s.freeThresholdYen;
    return { yen: free ? 0 : s.flatFeeYen, provisional: false };
  }
  return isShopTestMode() ? { yen: TEST_SHIPPING_YEN, provisional: true } : { yen: null, provisional: false };
}
