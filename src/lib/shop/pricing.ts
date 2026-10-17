import { getProductById, isPurchasable } from './products';
import { resolveShipping } from './shipping';
import { isPaymentConnected } from './payment';
import { isShopTestMode } from './testMode';
export { formatYen } from './format';
import type { CartIssue, CartLine, PricedCart, PricedLine } from './types';

export const MAX_QTY_PER_LINE = 99;

/** 信頼できない入力（JSON）をCartLine[]へ。IDごとに合算し、数量は整数のみ許可 */
export function sanitizeLines(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  const map = new Map<string, number>();
  for (const raw of input.slice(0, 50)) {
    if (!raw || typeof raw !== 'object') continue;
    const { id, qty } = raw as { id?: unknown; qty?: unknown };
    if (typeof id !== 'string' || id.length === 0 || id.length > 100) continue;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1) continue;
    map.set(id, Math.min((map.get(id) ?? 0) + qty, MAX_QTY_PER_LINE));
  }
  return Array.from(map, ([id, qty]) => ({ id, qty }));
}

// 価格・在庫・販売状態は常にサーバー側の商品データから決める（クライアントの価格は使わない）。金額は整数円。
export async function priceCart(lines: CartLine[], prefecture?: string): Promise<PricedCart> {
  const priced: PricedLine[] = [];
  const issues: CartIssue[] = [];

  for (const line of lines) {
    const p = await getProductById(line.id);
    if (!p) {
      issues.push({ id: line.id, kind: 'not_found' });
      continue;
    }
    if (!isPurchasable(p)) {
      issues.push({ id: p.id, kind: 'sold_out', name: p.name });
      continue;
    }
    const maxQty = Math.min(p.stock, MAX_QTY_PER_LINE);
    const qty = Math.min(line.qty, maxQty);
    if (qty !== line.qty) issues.push({ id: p.id, kind: 'qty_adjusted', name: p.name, qty });
    priced.push({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      unitPriceYen: p.priceYen,
      qty,
      lineTotalYen: p.priceYen * qty,
      maxQty,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      artistId: p.artistId,
      artistName: p.artistName,
    });
  }

  const subtotalYen = priced.reduce((s, l) => s + l.lineTotalYen, 0);
  const shipping = priced.length > 0 ? await resolveShipping(subtotalYen, prefecture) : { yen: null, provisional: false, remoteYen: null };
  const shippingYen = shipping.yen;
  const totalYen = shippingYen === null ? null : subtotalYen + shippingYen;

  const blockedReasons: string[] = [];
  if (priced.length === 0) blockedReasons.push('カートに購入可能な商品がありません。');
  const testMode = isShopTestMode();
  if (priced.length > 0 && shippingYen === null) blockedReasons.push('送料が未確定のため、注文を確定できません。');
  // テストモード中は決済未接続でも「テスト注文」として確定できる（実決済は行われない）
  if (!isPaymentConnected() && !testMode) blockedReasons.push('決済が未接続のため、注文を確定できません。');

  return { lines: priced, issues, subtotalYen, shippingYen, remoteShippingYen: shipping.remoteYen, shippingProvisional: shipping.provisional, totalYen, blockedReasons, testMode };
}
