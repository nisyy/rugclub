import { getAdminDb } from '@/lib/firebaseAdmin';

// 特定商取引法に基づく表記の設定。管理画面で編集し、Firestore（shop_settings/legal）に保存する。
// 既知の情報は初期値として入れてあり、事業者名・責任者名・引渡時期・返品条件は管理画面で入力が必要。
export interface LegalSettings {
  sellerName: string;       // 販売事業者名（屋号だけでなく事業者の氏名または法人名）
  representative: string;   // 運営責任者
  address: string;
  phone: string;
  email: string;
  paymentMethod: string;
  paymentTiming: string;
  deliveryTime: string;     // 商品の引渡時期
  returnPolicy: string;     // 返品・交換・キャンセル
  note: string;             // その他（任意）
}

export const LEGAL_DEFAULTS: LegalSettings = {
  sellerName: '',
  representative: '',
  address: '〒577-0058 大阪府東大阪市足代北2丁目15-22',
  phone: '06-6224-4030',
  email: 'rugclubjp@gmail.com',
  paymentMethod: 'クレジットカード',
  paymentTiming: 'ご注文時にお支払いが確定します（クレジットカード決済）',
  deliveryTime: '',
  returnPolicy: '',
  note: '',
};

export const LEGAL_LABELS: Record<keyof LegalSettings, string> = {
  sellerName: '販売事業者名',
  representative: '運営責任者',
  address: '所在地',
  phone: '電話番号',
  email: 'メールアドレス',
  paymentMethod: 'お支払い方法',
  paymentTiming: 'お支払い時期',
  deliveryTime: '商品の引渡時期',
  returnPolicy: '返品・交換・キャンセル',
  note: 'その他',
};

const REQUIRED: (keyof LegalSettings)[] = ['sellerName', 'representative', 'address', 'phone', 'email', 'paymentMethod', 'paymentTiming', 'deliveryTime', 'returnPolicy'];

/** 未入力の必須項目（空なら表記は完了） */
export function missingLegalFields(s: LegalSettings): (keyof LegalSettings)[] {
  return REQUIRED.filter((k) => !s[k].trim());
}

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
