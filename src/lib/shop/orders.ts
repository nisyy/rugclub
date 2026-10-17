import { createHash, randomInt } from 'crypto';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { PRODUCTS_COLLECTION } from './products';
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
export async function createOrder(
  idempotencyKey: string,
  cart: PricedCart,
  customer: Customer,
): Promise<{ order: OrderRecord; created: boolean }> {
  const db = requireDb();
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
      tx.update(productRefs[i], { stock: stock - l.qty });
    });

    const order: OrderRecord = {
      id,
      orderNumber: makeOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'received',
      testMode: cart.testMode,
      customer,
      lines: cart.lines.map((l) => ({ id: l.id, name: l.name, unitPriceYen: l.unitPriceYen, qty: l.qty, lineTotalYen: l.lineTotalYen })),
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
  return snap.docs.map((d) => d.data() as OrderRecord);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await requireDb().collection(COLLECTION).doc(id).update({ status });
}
