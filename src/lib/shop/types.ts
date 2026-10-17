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
}

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
  totalYen: number | null;
  /** 注文を進められない理由。空配列なら進行可能 */
  blockedReasons: string[];
}
