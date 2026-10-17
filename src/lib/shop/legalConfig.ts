// クライアント/サーバー共通（サーバー専用モジュールを import しないこと）
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

