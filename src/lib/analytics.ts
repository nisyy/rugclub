import { getAnalytics, logEvent, Analytics, isSupported } from 'firebase/analytics';
import { app } from './firebase';

let analyticsInstance: Analytics | null = null;

// 計測は本番のみ送信する（開発中のアクセスで数字が汚れないように）。開発中はコンソールに出力して確認できる。
const ENABLED = process.env.NODE_ENV === 'production';

/** Analytics インスタンスを取得（ブラウザ環境のみ） */
async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (analyticsInstance) return analyticsInstance;

  try {
    const supported = await isSupported();
    if (!supported) return null;
    analyticsInstance = getAnalytics(app);
    return analyticsInstance;
  } catch {
    return null;
  }
}

/** ページビューを記録 */
export async function logPageView(path: string) {
  await logCustomEvent('page_view', { page_path: path });
}

/** カスタムイベントを記録 */
export async function logCustomEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (!ENABLED) {
    if (typeof window !== 'undefined') console.debug('[analytics:dev]', eventName, params);
    return;
  }
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  logEvent(analytics, eventName, params);
}

// ─── ショップ用（GA4 の推奨eコマースイベント） ───
// 氏名・メール・住所などの個人情報は送らない。商品ID・名前・金額・個数のみ。
export interface TrackItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  artist?: string | null;
  category?: string | null;
}

function toGaItems(items: TrackItem[]) {
  return items.map((i) => ({
    item_id: i.id,
    item_name: i.name,
    price: i.price,
    quantity: i.quantity ?? 1,
    ...(i.artist ? { item_brand: i.artist } : {}),
    ...(i.category ? { item_category: i.category } : {}),
  }));
}

export function trackShop(
  event: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'view_cart' | 'begin_checkout' | 'purchase',
  items: TrackItem[],
  extra?: { transactionId?: string; shipping?: number },
) {
  const value = items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);
  return logCustomEvent(event, {
    currency: 'JPY',
    value: event === 'purchase' ? value + (extra?.shipping ?? 0) : value,
    items: toGaItems(items),
    ...(extra?.transactionId ? { transaction_id: extra.transactionId } : {}),
    ...(extra?.shipping !== undefined ? { shipping: extra.shipping } : {}),
  });
}

/** ショップ内検索（検索キーワード） */
export function trackSearch(term: string) {
  return logCustomEvent('search', { search_term: term.slice(0, 100) });
}
