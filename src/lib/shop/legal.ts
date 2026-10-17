import { getAdminDb } from '@/lib/firebaseAdmin';
import { LEGAL_DEFAULTS, LEGAL_LABELS, type LegalSettings } from './legalConfig';

export { LEGAL_DEFAULTS, LEGAL_LABELS, missingLegalFields } from './legalConfig';
export type { LegalSettings } from './legalConfig';

export async function getLegalSettings(): Promise<LegalSettings> {
  const db = getAdminDb();
  const out = { ...LEGAL_DEFAULTS };
  if (db) {
    try {
      const d = (await db.collection('shop_settings').doc('legal').get()).data();
      if (d) for (const k of Object.keys(out) as (keyof LegalSettings)[]) if (typeof d[k] === 'string') out[k] = d[k];
    } catch (e) {
      console.error('[shop legal] 読み込み失敗:', e instanceof Error ? e.message : e);
    }
  }
  return out;
}

export function parseLegalSettings(raw: unknown): LegalSettings | string {
  const r = (raw ?? {}) as Record<string, unknown>;
  const out = { ...LEGAL_DEFAULTS };
  for (const k of Object.keys(out) as (keyof LegalSettings)[]) {
    const v = typeof r[k] === 'string' ? (r[k] as string).trim() : '';
    const max = k === 'returnPolicy' || k === 'note' || k === 'deliveryTime' ? 2000 : 300;
    if (v.length > max) return `${LEGAL_LABELS[k]}は${max}文字以内で入力してください`;
    out[k] = v;
  }
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) return '正しいメールアドレスを入力してください';
  return out;
}

export async function saveLegalSettings(s: LegalSettings): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error('Firestoreに接続できません（FIREBASE_* 環境変数を確認してください）');
  await db.collection('shop_settings').doc('legal').set({ ...s, updatedAt: new Date().toISOString() });
}
