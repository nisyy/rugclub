import { getAdminDb } from '@/lib/firebaseAdmin';
import { MAX_COMMISSION_PERCENT } from './commission';
import type { Artist, Taxonomy, TaxonomyKind } from './types';

// 作家・カテゴリのマスタ（Firestore: shop_artists / shop_categories）。管理画面で作成・編集・削除する。
const COLLECTION: Record<TaxonomyKind, string> = { artists: 'shop_artists', categories: 'shop_categories' };
const PRODUCT_FIELD: Record<TaxonomyKind, string> = { artists: 'artistId', categories: 'categoryId' };

export function isTaxonomyKind(v: unknown): v is TaxonomyKind {
  return v === 'artists' || v === 'categories';
}

export const SAMPLE_ARTISTS: Artist[] = [
  { id: 'sample-artist-a', name: 'サンプル作家A', order: 1, phone: '', email: '', commissionPercent: 20 },
  { id: 'sample-artist-b', name: 'サンプル作家B', order: 2, phone: '', email: '', commissionPercent: 10 },
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

// ─── 作家（連絡先・オンライン販売手数料つき。管理画面専用） ───

export interface ArtistInput {
  name: string;
  phone: string;
  email: string;
  commissionPercent: number;
}

export function parseArtistInput(raw: unknown): ArtistInput | string {
  const r = (raw ?? {}) as Record<string, unknown>;
  const name = parseName(r.name);
  if (!name) return '作家名は1〜100文字で入力してください';
  const phone = typeof r.phone === 'string' ? r.phone.trim() : '';
  if (!/^[0-9+\-() ]{6,20}$/.test(phone)) return '電話番号は数字・ハイフンで入力してください（例：090-1234-5678）';
  const email = typeof r.email === 'string' ? r.email.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return '正しいメールアドレスを入力してください';
  const pct = typeof r.commissionPercent === 'string' && r.commissionPercent.trim() === '' ? NaN : Number(r.commissionPercent);
  if (!Number.isInteger(pct) || pct < 0 || pct > MAX_COMMISSION_PERCENT) return `手数料は0〜${MAX_COMMISSION_PERCENT}%の整数で入力してください`;
  return { name, phone, email, commissionPercent: pct };
}

/** 作家一覧（連絡先・手数料つき）。Firestore未接続時は null */
export async function listArtists(): Promise<Artist[] | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection(COLLECTION.artists).get();
    return snap.docs
      .map((d) => {
        const x = d.data();
        return {
          id: d.id,
          name: String(x.name ?? ''),
          order: Number.isFinite(x.order) ? x.order : 999,
          phone: String(x.phone ?? ''),
          email: String(x.email ?? ''),
          commissionPercent: Number.isInteger(x.commissionPercent) ? x.commissionPercent : null,
        } as Artist;
      })
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'ja'));
  } catch (e) {
    console.error('[shop taxonomy] artists 読み込み失敗:', e instanceof Error ? e.message : e);
    return null;
  }
}

export async function createArtist(input: ArtistInput): Promise<string> {
  const db = requireDb();
  const col = db.collection(COLLECTION.artists);
  const dup = await col.where('name', '==', input.name).limit(1).get();
  if (!dup.empty) throw new Error('同じ名前の作家がすでに登録されています');
  const all = await col.get();
  const maxOrder = all.docs.reduce((m, d) => Math.max(m, Number(d.data().order) || 0), 0);
  const ref = await col.add({ ...input, order: maxOrder + 1, createdAt: new Date().toISOString() });
  return ref.id;
}

export async function updateArtist(id: string, input: ArtistInput): Promise<void> {
  await requireDb().collection(COLLECTION.artists).doc(id).update({ ...input, updatedAt: new Date().toISOString() });
}
