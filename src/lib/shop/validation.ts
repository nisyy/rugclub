import type { Customer } from './types';

export const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

export const EMPTY_CUSTOMER: Customer = {
  name: '', email: '', postalCode: '', prefecture: '', city: '', address2: '',
};

export type CustomerErrors = Partial<Record<keyof Customer, string>>;

export function validateCustomer(c: Customer): CustomerErrors {
  const e: CustomerErrors = {};
  if (!c.name.trim()) e.name = 'お名前を入力してください';
  else if (c.name.length > 100) e.name = 'お名前が長すぎます';
  if (!c.email.trim()) e.email = 'メールアドレスを入力してください';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) || c.email.length > 254) e.email = '正しいメールアドレスを入力してください';
  if (!c.postalCode.trim()) e.postalCode = '郵便番号を入力してください';
  else if (!/^\d{3}-?\d{4}$/.test(c.postalCode.trim())) e.postalCode = '郵便番号は7桁の数字で入力してください（例：123-4567）';
  if (!c.prefecture) e.prefecture = '都道府県を選択してください';
  else if (!PREFECTURES.includes(c.prefecture)) e.prefecture = '都道府県が正しくありません';
  if (!c.city.trim()) e.city = '市区町村・住所を入力してください';
  else if (c.city.length > 200) e.city = '住所が長すぎます';
  if (c.address2.length > 200) e.address2 = '建物名・部屋番号が長すぎます';
  return e;
}
