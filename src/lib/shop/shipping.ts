import { getAdminDb } from '@/lib/firebaseAdmin';
import { isShopTestMode } from './testMode';
import { computeShipping } from './shippingCalc';
import type { ShippingSettings } from './shippingCalc';

// 標準の送料設定（コードで確定）。管理画面の「送料設定」で保存すると、その内容が優先される。
// 地域別などルールを増やす場合は、shippingCalc.ts の computeShipping を拡張する。
export const DEFAULT_SHIPPING: ShippingSettings = {
  flatFeeYen: 800,          // 北海道・沖縄以外
  remoteFeeYen: 1000,       // 北海道・沖縄
  freeThresholdYen: 5000,   // 税込5,000円以上で全国送料無料
};
export type { ShippingSettings } from './shippingCalc';

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
          remoteFeeYen: Number.isInteger(d.remoteFeeYen) ? d.remoteFeeYen : null,
          freeThresholdYen: Number.isInteger(d.freeThresholdYen) ? d.freeThresholdYen : null,
        };
      }
    } catch (e) {
      console.error('[shop shipping] 読み込み失敗:', e instanceof Error ? e.message : e);
    }
  }
  // 管理画面で保存されていない（または読み込めない）場合は標準設定
  return { ...DEFAULT_SHIPPING };
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
  const remote = num(r.remoteFeeYen, '北海道・沖縄の送料');
  if (typeof remote === 'string') return remote;
  const free = num(r.freeThresholdYen, '送料無料の条件金額');
  if (typeof free === 'string') return free;
  return { flatFeeYen: flat, remoteFeeYen: remote, freeThresholdYen: free };
}

export async function saveShippingSettings(s: ShippingSettings): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error('Firestoreに接続できません（FIREBASE_* 環境変数を確認してください）');
  await db.collection(DOC[0]).doc(DOC[1]).set({ ...s, updatedAt: new Date().toISOString() });
}

export { REMOTE_PREFECTURES, computeShipping } from './shippingCalc';

export async function resolveShipping(subtotalYen: number, prefecture?: string) {
  return computeShipping(await getShippingSettings(), subtotalYen, prefecture, isShopTestMode());
}
