export type ProductStatus = 'on_sale' | 'sold_out' | 'hidden';

export interface Product {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string;
  /** 販売価格（税込・円・整数） */
  priceYen: number;
  stock: number;
  status: ProductStatus;
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
  /** 送料が管理画面の設定ではなく、テスト用の仮値である */
  shippingProvisional: boolean;
  totalYen: number | null;
  /** 注文を進められない理由。空配列なら進行可能 */
  blockedReasons: string[];
  /** テストモード（仮送料・テスト注文）で動作中 */
  testMode: boolean;
}

export type OrderStatus = 'received' | 'shipped' | 'canceled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  testMode: boolean;
  customer: Customer;
  lines: { id: string; name: string; unitPriceYen: number; qty: number; lineTotalYen: number }[];
  subtotalYen: number;
  shippingYen: number;
  shippingProvisional: boolean;
  totalYen: number;
  mail: { customer: 'sent' | 'failed' | 'skipped'; shop: 'sent' | 'failed' | 'skipped' };
}

export type ProductInput = Omit<Product, 'id' | 'artistName' | 'categoryName'> & { order: number };
export type AdminProduct = Product & { order: number };
