import { getAnalytics, logEvent, Analytics, isSupported } from 'firebase/analytics';
import { app } from './firebase';

let analyticsInstance: Analytics | null = null;

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
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  logEvent(analytics, 'page_view', { page_path: path });
}

/** カスタムイベントを記録 */
export async function logCustomEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  logEvent(analytics, eventName, params);
}
