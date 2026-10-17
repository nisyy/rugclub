export type ProductStatus = 'on_sale' | 'sold_out' | 'hidden';

export interface Product {
  id: string;
  name: string;
  /** 先頭の画像（一覧・カート用） */
  imageUrl: string | null;
  /** 商品画像（複数・表示順）。先頭が imageUrl */
  imageUrls: string[];
  description: string;
  /** 販売価格（税込・円・整数） */
  priceYen: number;
  stock: number;
  status: ProductStatus;
  /** 登録日時（ISO）。新着順の並びに使う */
  createdAt: string;
  /** 販売数量の累計（テスト注文・キャンセル分は含まない）。人気順の並びに使う */
  soldCount: number;
  /** 作家・カテゴリ（マスタのID）。未設定は null */
  artistId: string | null;
  categoryId: string | null;
  /** マスタから解決した表示名（読み取り時に付与） */
  artistName: string | null;
  categoryName: string | null;
}

export interface Taxonomy {
  id: string;
  name: string;
  order: number;
}
/** 作家（管理画面専用の連絡先・手数料を含む。公開側には名前だけを渡すこと） */
export interface Artist extends Taxonomy {
  phone: string;
  email: string;
  /** オンライン販売手数料（%・0〜60の整数）。null＝未設定（0%として計算） */
  commissionPercent: number | null;
}
export type TaxonomyKind = 'artists' | 'categories';

/** ブラウザ（カート）が保持するのは商品IDと数量のみ */
export interface CartLine {
  id: string;
  qty: number;
}

export interface PricedLine {
  id: string;
  name: string;
  imageUrl: string | null;
  unitPriceYen: number;
  qty: number;
  lineTotalYen: number;
  maxQty: number;
  categoryId: string | null;
  categoryName: string | null;
  artistId: string | null;
  artistName: string | null;
}

export type CartIssue =
  | { id: string; kind: 'not_found' }
  | { id: string; kind: 'sold_out'; name: string }
  | { id: string; kind: 'qty_adjusted'; name: string; qty: number };

export interface Customer {
  name: string;
  email: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address2: string;
}

export interface PricedCart {
  lines: PricedLine[];
  issues: CartIssue[];
  subtotalYen: number;
  /** 送料ルール未確定の間は null */
  shippingYen: number | null;
  /** 北海道・沖縄の送料が一般地域と異なる場合の金額（案内表示用） */
  remoteShippingYen: number | null;
  /** 送料が管理画面の設定ではなく、テスト用の仮値である */
  shippingProvisional: boolean;
  totalYen: number | null;
  /** 注文を進められない理由。空配列なら進行可能 */
  blockedReasons: string[];
  /** テストモード（仮送料・テスト注文）で動作中 */
  testMode: boolean;
}

export type OrderStatus = 'received' | 'packing' | 'shipped' | 'canceled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  testMode: boolean;
  customer: Customer;
  lines: { id: string; name: string; unitPriceYen: number; qty: number; lineTotalYen: number; categoryId?: string | null; categoryName?: string | null; artistId?: string | null; artistName?: string | null; commissionPercent?: number; commissionYen?: number; payoutYen?: number }[];
  subtotalYen: number;
  shippingYen: number;
  shippingProvisional: boolean;
  totalYen: number;
  mail: { customer: 'sent' | 'failed' | 'skipped'; shop: 'sent' | 'failed' | 'skipped' };
  /** 発送情報（発送済みにした時に記録） */
  carrier?: string;
  trackingNumber?: string;
  shippedAt?: string;
  shippedMail?: 'sent' | 'failed' | 'skipped';
  /** キャンセル時に在庫を戻し済み（二重に戻さないためのフラグ） */
  stockRestored?: boolean;
  /** 作家ごとの精算済み記録（キー＝作家ID） */
  settlements?: Record<string, { settledAt: string }>;
}

export type ProductInput = Omit<Product, 'id' | 'artistName' | 'categoryName' | 'createdAt' | 'soldCount'> & { order: number };
export type AdminProduct = Product & { order: number };
