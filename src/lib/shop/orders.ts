import { createHash, randomInt } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { listAllProducts, PRODUCTS_COLLECTION } from './products';
import { calcCommission } from './commission';
import { listArtists, SAMPLE_ARTISTS } from './taxonomy';
import type { Customer, OrderRecord, OrderStatus, PricedCart } from './types';

const COLLECTION = 'shop_orders';

function requireDb() {
  const db = getAdminDb();
  if (!db) throw new Error('Firestoreに接続できません（FIREBASE_* 環境変数を確認してください）');
  return db;
}

function makeOrderNumber(): string {
  const d = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[randomInt(32)]).join('');
  return `RC-${d}-${rand}`;
}

export class OutOfStockError extends Error {
  constructor(public productName: string) {
    super('out_of_stock');
  }
}

/**
 * 注文を保存し、在庫を引き当てる（トランザクション）。
 * idempotencyKey が同じ注文は二重に処理せず、既存の注文を返す（created=false）。
 * Stripe Webhook 実装時は、イベントIDを同じ仕組みの冪等キーとして使う。
 */
/** 作家IDごとのオンライン販売手数料率（%）。Firestoreの登録が優先、未設定は0% */
async function commissionRates(): Promise<Map<string, number>> {
  const m = new Map<string, number>(SAMPLE_ARTISTS.map((a) => [a.id, a.commissionPercent ?? 0]));
  for (const a of (await listArtists()) ?? []) m.set(a.id, a.commissionPercent ?? 0);
  return m;
}

export async function createOrder(
  idempotencyKey: string,
  cart: PricedCart,
  customer: Customer,
): Promise<{ order: OrderRecord; created: boolean }> {
  const db = requireDb();
  const rates = await commissionRates();
  const id = createHash('sha256').update(idempotencyKey).digest('hex').slice(0, 40);
  const ref = db.collection(COLLECTION).doc(id);

  return db.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) return { order: existing.data() as OrderRecord, created: false };

    const productRefs = cart.lines.map((l) => db.collection(PRODUCTS_COLLECTION).doc(l.id));
    const productSnaps = await Promise.all(productRefs.map((r) => tx.get(r)));

    cart.lines.forEach((l, i) => {
      const snap = productSnaps[i];
      // Firestoreに無い商品（サンプル表示中）は在庫引き当てをスキップする
      if (!snap.exists) return;
      const stock = Number(snap.data()?.stock ?? 0);
      if (snap.data()?.status !== 'on_sale' || stock < l.qty) throw new OutOfStockError(l.name);
      // 人気順の集計用に販売数量を加算（テスト注文は数えない）
      tx.update(productRefs[i], { stock: stock - l.qty, ...(cart.testMode ? {} : { soldCount: FieldValue.increment(l.qty) }) });
    });

    const order: OrderRecord = {
      id,
      orderNumber: makeOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'received',
      testMode: cart.testMode,
      customer,
      lines: cart.lines.map((l) => ({ id: l.id, name: l.name, unitPriceYen: l.unitPriceYen, qty: l.qty, lineTotalYen: l.lineTotalYen, categoryId: l.categoryId, categoryName: l.categoryName, artistId: l.artistId, artistName: l.artistName, ...calcCommission(l.lineTotalYen, l.artistId ? rates.get(l.artistId) ?? 0 : 0) })),
      subtotalYen: cart.subtotalYen,
      shippingYen: cart.shippingYen ?? 0,
      shippingProvisional: cart.shippingProvisional,
      totalYen: cart.totalYen ?? cart.subtotalYen,
      mail: { customer: 'skipped', shop: 'skipped' },
    };
    tx.set(ref, order);
    return { order, created: true };
  });
}

export async function updateOrderMail(id: string, mail: OrderRecord['mail']): Promise<void> {
  await requireDb().collection(COLLECTION).doc(id).update({ mail });
}

export async function listOrders(): Promise<OrderRecord[]> {
  const snap = await requireDb().collection(COLLECTION).orderBy('createdAt', 'desc').limit(200).get();
  const orders = snap.docs.map((d) => d.data() as OrderRecord);
  // カテゴリ導入前の注文など、カテゴリ情報が無い明細は現在の商品情報から補完する
  if (orders.some((o) => o.lines.some((l) => l.categoryName === undefined || l.artistName === undefined))) {
    const [{ products }, rates] = await Promise.all([listAllProducts(), commissionRates()]);
    const byId = new Map(products.map((p) => [p.id, p]));
    for (const o of orders) {
      for (const l of o.lines) {
        const p = byId.get(l.id);
        if (l.categoryName === undefined) {
          l.categoryId = p?.categoryId ?? null;
          l.categoryName = p?.categoryName ?? null;
        }
        if (l.artistName === undefined) {
          l.artistId = p?.artistId ?? null;
          l.artistName = p?.artistName ?? null;
          Object.assign(l, calcCommission(l.lineTotalYen, l.artistId ? rates.get(l.artistId) ?? 0 : 0));
        }
      }
    }
  }
  return orders;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await requireDb().collection(COLLECTION).doc(id).update({ status });
}

export async function getOrder(id: string): Promise<OrderRecord | null> {
  const snap = await requireDb().collection(COLLECTION).doc(id).get();
  return snap.exists ? (snap.data() as OrderRecord) : null;
}

export async function updateOrderFields(id: string, fields: Partial<OrderRecord>): Promise<void> {
  await requireDb().collection(COLLECTION).doc(id).update(fields);
}

/** 作家ごとの精算済みチェック（settled=false で取り消し） */
export async function setSettlement(id: string, artistId: string, settled: boolean): Promise<void> {
  const key = `settlements.${artistId}`;
  await requireDb()
    .collection(COLLECTION)
    .doc(id)
    .update({ [key]: settled ? { settledAt: new Date().toISOString() } : FieldValue.delete() });
}

/**
 * キャンセル注文の在庫を戻す（二重に戻さない）。販売数量（人気順）も差し引く。
 * Firestoreに無い商品（サンプル表示中の商品）はスキップする。
 */
export async function restoreStock(orderId: string): Promise<{ restored: number }> {
  const db = requireDb();
  const ref = db.collection(COLLECTION).doc(orderId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('注文が見つかりません');
    const order = snap.data() as OrderRecord;
    if (order.status !== 'canceled') throw new Error('キャンセル済みの注文のみ在庫を戻せます');
    if (order.stockRestored) throw new Error('この注文の在庫はすでに戻してあります');
    const prodRefs = order.lines.map((l) => db.collection(PRODUCTS_COLLECTION).doc(l.id));
    const prodSnaps = await Promise.all(prodRefs.map((r) => tx.get(r)));
    let restored = 0;
    order.lines.forEach((l, i) => {
      if (!prodSnaps[i].exists) return;
      tx.update(prodRefs[i], { stock: FieldValue.increment(l.qty), ...(order.testMode ? {} : { soldCount: FieldValue.increment(-l.qty) }) });
      restored += l.qty;
    });
    tx.update(ref, { stockRestored: true });
    return { restored };
  });
}
