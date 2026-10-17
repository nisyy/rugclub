import type { Product } from './types';

// 仮データ。商品名に「サンプル」を付け、実在商品と誤認されないようにしている。
// 保存先を Notion 等へ移す場合は、このファイルの関数の中身だけ差し替える。
const PRODUCTS: Product[] = [
  { id: 'sample-001', name: 'サンプル商品｜オリジナルトートバッグ', imageUrl: null, description: 'これは表示確認用のサンプル商品です。実際の販売商品ではありません。', priceYen: 2800, stock: 10, status: 'on_sale' },
  { id: 'sample-002', name: 'サンプル商品｜アートポストカード（3枚組）', imageUrl: null, description: 'これは表示確認用のサンプル商品です。実際の販売商品ではありません。', priceYen: 660, stock: 30, status: 'on_sale' },
  { id: 'sample-003', name: 'サンプル商品｜ステッカーセット', imageUrl: null, description: 'これは表示確認用のサンプル商品です。実際の販売商品ではありません。', priceYen: 550, stock: 3, status: 'on_sale' },
  { id: 'sample-004', name: 'サンプル商品｜ミニ原画プリント', imageUrl: null, description: 'これは表示確認用のサンプル商品です。実際の販売商品ではありません。', priceYen: 4400, stock: 0, status: 'sold_out' },
  { id: 'sample-005', name: 'サンプル商品｜マグカップ', imageUrl: null, description: 'これは表示確認用のサンプル商品です。実際の販売商品ではありません。', priceYen: 2200, stock: 5, status: 'on_sale' },
  { id: 'sample-999', name: '（非公開サンプル）', imageUrl: null, description: '非公開のため一覧・詳細には表示されません。', priceYen: 1000, stock: 1, status: 'hidden' },
];

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.status !== 'hidden');
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = PRODUCTS.find((x) => x.id === id);
  return p && p.status !== 'hidden' ? p : null;
}

export function isPurchasable(p: Product): boolean {
  return p.status === 'on_sale' && p.stock > 0;
}
