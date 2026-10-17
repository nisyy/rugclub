import { getAdminDb } from '@/lib/firebaseAdmin';
import type { Taxonomy, TaxonomyKind } from './types';

// 作家・カテゴリのマスタ（Firestore: shop_artists / shop_categories）。管理画面で作成・編集・削除する。
const COLLECTION: Record<TaxonomyKind, string> = { artists: 'shop_artists', categories: 'shop_categories' };
const PRODUCT_FIELD: Record<TaxonomyKind, string> = { artists: 'artistId', categories: 'categoryId' };

export function isTaxonomyKind(v: unknown): v is TaxonomyKind {
  return v === 'artists' || v === 'categories';
}

export const SAMPLE_ARTISTS: Taxonomy[] = [
  { id: 'sample-artist-a', name: 'サンプル作家A', order: 1 },
  { id: 'sample-artist-b', name: 'サンプル作家B', order: 2 },
];
export const SAMPLE_CATEGORIES: Taxonomy[] = [
  { id: 'sample-cat-goods', name: 'グッズ', order: 1 },
  { id: 'sample-cat-print', name: 'プリント・原画', order: 2 },
];

function requireDb() {
  const db = getAdminDb();
  if (!db) throw new Error('Firestoreに接続できません（FIREBASE_* 環境変数を確認してください）');
  return db;
}

/** 未接続/空の場合は null（呼び出し側でサンプルにフォールバック） */
export async function listTaxonomy(kind: TaxonomyKind): Promise<Taxonomy[] | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection(COLLECTION[kind]).get();
    return snap.docs
      .map((d) => ({ id: d.id, name: String(d.data().name ?? ''), order: Number.isFinite(d.data().order) ? d.data().order : 999 }))
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'ja'));
  } catch (e) {
    console.error(`[shop taxonomy] ${kind} 読み込み失敗:`, e instanceof Error ? e.message : e);
    return null;
  }
}

export function parseName(raw: unknown): string | null {
  const name = typeof raw === 'string' ? raw.trim() : '';
  return name && name.length <= 100 ? name : null;
}

export async function createTaxonomy(kind: TaxonomyKind, name: string): Promise<string> {
  const db = requireDb();
  const col = db.collection(COLLECTION[kind]);
  const dup = await col.where('name', '==', name).limit(1).get();
  if (!dup.empty) throw new Error('同じ名前がすでに登録されています');
  const all = await col.get();
  const maxOrder = all.docs.reduce((m, d) => Math.max(m, Number(d.data().order) || 0), 0);
  const ref = await col.add({ name, order: maxOrder + 1, createdAt: new Date().toISOString() });
  return ref.id;
}

export async function renameTaxonomy(kind: TaxonomyKind, id: string, name: string): Promise<void> {
  await requireDb().collection(COLLECTION[kind]).doc(id).update({ name });
}

export async function deleteTaxonomy(kind: TaxonomyKind, id: string): Promise<void> {
  const db = requireDb();
  const used = await db.collection('shop_products').where(PRODUCT_FIELD[kind], '==', id).limit(1).get();
  if (!used.empty) throw new Error('この項目は商品で使用されているため削除できません。先に商品側の設定を変更してください');
  await db.collection(COLLECTION[kind]).doc(id).delete();
}
