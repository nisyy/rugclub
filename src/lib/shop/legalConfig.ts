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
  sellerName: 'CAFE RUG CLUB（坂本 将）',
  representative: '坂本 将',
  address: '〒577-0058 大阪府東大阪市足代北2丁目15-22',
  phone: '06-6224-4030',
  email: 'rugclubjp@gmail.com',
  paymentMethod: 'クレジットカード',
  paymentTiming: 'ご注文時にお支払いが確定します（クレジットカード決済）',
  deliveryTime: 'ご注文（お支払い完了）から2〜3日以内に発送します。\n発送後のお届けまでの日数は、配送地域・配送状況により異なります。',
  returnPolicy: [
    '【お客様のご都合による返品・交換】',
    '商品の性質上（作品・グッズ）、お客様のご都合による返品・交換はお受けできません。ご注文前に、商品ページのサイズ・画像・説明をご確認ください。',
    '',
    '【商品に不備があった場合】',
    '商品の破損・汚損、ご注文と異なる商品が届いた場合は、商品到着後7日以内にお問い合わせフォームまたはメールでご連絡ください。送料は当店が負担し、商品の交換または返金をいたします。到着後7日を過ぎた場合はお受けできません。',
    '',
    '【ご注文のキャンセル】',
    'お支払い完了後のキャンセルは、発送前に限りお受けします。発送後のキャンセルはお受けできません。キャンセルの場合は、お支払いに使用したクレジットカードへ返金します（カード会社の処理により、反映まで日数がかかる場合があります）。',
  ].join('\n'),
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

