import { getAdminDb } from '@/lib/firebaseAdmin';
import { listTaxonomy, SAMPLE_ARTISTS, SAMPLE_CATEGORIES } from './taxonomy';
import type { AdminProduct, Product, ProductInput, ProductStatus } from './types';

// 商品の保存先は Firestore（コレクション shop_products）。サーバー（Admin SDK）からのみ読み書きする。
// Firestore が未設定・空の間は、表示確認用のサンプル商品を返す。
// 保存先を変える場合は、このファイルの関数の中身だけ差し替える。
const COLLECTION = 'shop_products';

const SAMPLE_DESC = 'これは表示確認用のサンプル商品です。実際の販売商品ではありません。';
const SAMPLES: AdminProduct[] = [
  { id: 'sample-001', name: 'サンプル商品｜オリジナルトートバッグ', imageUrl: null, description: SAMPLE_DESC, priceYen: 2800, stock: 10, status: 'on_sale', order: 1, artistId: 'sample-artist-a', categoryId: 'sample-cat-goods', artistName: 'サンプル作家A', categoryName: 'グッズ' },
  { id: 'sample-002', name: 'サンプル商品｜アートポストカード（3枚組）', imageUrl: null, description: SAMPLE_DESC, priceYen: 660, stock: 30, status: 'on_sale', order: 2, artistId: 'sample-artist-a', categoryId: 'sample-cat-goods', artistName: 'サンプル作家A', categoryName: 'グッズ' },
  { id: 'sample-003', name: 'サンプル商品｜ステッカーセット', imageUrl: null, description: SAMPLE_DESC, priceYen: 550, stock: 3, status: 'on_sale', order: 3, artistId: 'sample-artist-b', categoryId: 'sample-cat-goods', artistName: 'サンプル作家B', categoryName: 'グッズ' },
  { id: 'sample-004', name: 'サンプル商品｜ミニ原画プリント', imageUrl: null, description: SAMPLE_DESC, priceYen: 4400, stock: 0, status: 'sold_out', order: 4, artistId: 'sample-artist-b', categoryId: 'sample-cat-print', artistName: 'サンプル作家B', categoryName: 'プリント・原画' },
  { id: 'sample-005', name: 'サンプル商品｜マグカップ', imageUrl: null, description: SAMPLE_DESC, priceYen: 2200, stock: 5, status: 'on_sale', order: 5, artistId: 'sample-artist-a', categoryId: 'sample-cat-goods', artistName: 'サンプル作家A', categoryName: 'グッズ' },
  { id: 'sample-999', name: '（非公開サンプル）', imageUrl: null, description: '非公開のため一覧・詳細には表示されません。', priceYen: 1000, stock: 1, status: 'hidden', order: 6, artistId: null, categoryId: null, artistName: null, categoryName: null },
];

const STATUSES: ProductStatus[] = ['on_sale', 'sold_out', 'hidden'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToProduct(id: string, d: any, artists: Map<string, string>, categories: Map<string, string>): AdminProduct {
  const artistId = d.artistId ? String(d.artistId) : null;
  const categoryId = d.categoryId ? String(d.categoryId) : null;
  return {
    id,
    name: String(d.name ?? ''),
    description: String(d.description ?? ''),
    imageUrl: d.imageUrl ? String(d.imageUrl) : null,
    priceYen: Number.isInteger(d.priceYen) ? d.priceYen : 0,
    stock: Number.isInteger(d.stock) ? d.stock : 0,
    status: STATUSES.includes(d.status) ? d.status : 'hidden',
    order: Number.isFinite(d.order) ? d.order : 999,
    artistId,
    categoryId,
    artistName: artistId ? artists.get(artistId) ?? null : null,
    categoryName: categoryId ? categories.get(categoryId) ?? null : null,
  };
}

/** 管理画面用: 非公開も含む全件。Firestoreが空/未設定なら usingSamples=true でサンプルを返す */
export async function listAllProducts(): Promise<{ products: AdminProduct[]; usingSamples: boolean }> {
  const db = getAdminDb();
  if (db) {
    try {
      const snap = await db.collection(COLLECTION).get();
      if (!snap.empty) {
        const [artists, categories] = await Promise.all([listTaxonomy('artists'), listTaxonomy('categories')]);
        const aMap = new Map((artists ?? []).map((t) => [t.id, t.name]));
        const cMap = new Map((categories ?? []).map((t) => [t.id, t.name]));
        const products = snap.docs.map((d) => docToProduct(d.id, d.data(), aMap, cMap)).sort((a, b) => a.order - b.order);
        return { products, usingSamples: false };
      }
    } catch (e) {
      console.error('[shop products] Firestore読み込み失敗（サンプルを表示）:', e instanceof Error ? e.message : e);
    }
  }
  return { products: SAMPLES, usingSamples: true };
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await listAllProducts();
  return products.filter((p) => p.status !== 'hidden');
}

export async function getProductById(id: string): Promise<Product | null> {
  const { products } = await listAllProducts();
  const p = products.find((x) => x.id === id);
  return p && p.status !== 'hidden' ? p : null;
}

export function isPurchasable(p: Product): boolean {
  return p.status === 'on_sale' && p.stock > 0;
}

// ─── 管理画面用の書き込み ───
/** 作家・カテゴリの選択肢（Firestore未使用の間はサンプル） */
export async function getTaxonomies(forAdmin = false) {
  const [artists, categories] = await Promise.all([listTaxonomy('artists'), listTaxonomy('categories')]);
  // 管理画面ではサンプルの作家・カテゴリは出さない（保存すると実在しないIDになるため）
  const usingSamples = !forAdmin && (await listAllProducts()).usingSamples;
  return {
    artists: usingSamples && !artists?.length ? SAMPLE_ARTISTS : artists ?? [],
    categories: usingSamples && !categories?.length ? SAMPLE_CATEGORIES : categories ?? [],
  };
}

export function parseProductInput(raw: unknown): ProductInput | string {
  const r = (raw ?? {}) as Record<string, unknown>;
  const name = typeof r.name === 'string' ? r.name.trim() : '';
  if (!name || name.length > 200) return '商品名は1〜200文字で入力してください';
  const priceYen = Number(r.priceYen);
  if (!Number.isInteger(priceYen) || priceYen < 0 || priceYen > 10_000_000) return '価格は0以上の整数（円・税込）で入力してください';
  const stock = Number(r.stock);
  if (!Number.isInteger(stock) || stock < 0 || stock > 100_000) return '在庫数は0以上の整数で入力してください';
  const status = r.status as ProductStatus;
  if (!STATUSES.includes(status)) return '販売状態が正しくありません';
  const description = typeof r.description === 'string' ? r.description.slice(0, 5000) : '';
  const imageUrl = typeof r.imageUrl === 'string' && r.imageUrl.trim() ? r.imageUrl.trim() : null;
  const order = Number.isFinite(Number(r.order)) ? Number(r.order) : 999;
  const id = (v: unknown) => (typeof v === 'string' && v.trim() && v.length <= 100 ? v.trim() : null);
  return { name, description, imageUrl, priceYen, stock, status, order, artistId: id(r.artistId), categoryId: id(r.categoryId) };
}

function requireDb() {
  const db = getAdminDb();
  if (!db) throw new Error('Firestoreに接続できません（FIREBASE_* 環境変数を確認してください）');
  return db;
}

export async function createProduct(input: ProductInput): Promise<string> {
  const ref = await requireDb().collection(COLLECTION).add({ ...input, createdAt: new Date().toISOString() });
  return ref.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await requireDb().collection(COLLECTION).doc(id).update({ ...input, updatedAt: new Date().toISOString() });
}

export async function deleteProduct(id: string): Promise<void> {
  await requireDb().collection(COLLECTION).doc(id).delete();
}

export const PRODUCTS_COLLECTION = COLLECTION;
