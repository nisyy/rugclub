import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin Auth を遅延初期化して返す。
 * 環境変数未設定の場合は null を返す（ログイン自体はブロックしない）。
 */
export function getAdminAuth(): Auth | null {
  // デバッグ: 各環境変数の存在確認（値は出力しない）
  console.log('[firebaseAdmin] env check:', {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? `"${process.env.FIREBASE_PROJECT_ID}"` : 'undefined',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '(set)' : 'undefined',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? `(set, length=${process.env.FIREBASE_PRIVATE_KEY.length})` : 'undefined',
  });

  try {
    const existing = getApps().find((a) => a.name === 'ragclub-admin');
    const app =
      existing ??
      initializeApp(
        {
          credential: cert({
            // FIREBASE_PROJECT_ID がなければ公開変数にフォールバック
            projectId:
              process.env.FIREBASE_PROJECT_ID ??
              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // 環境変数中の "\n" を実際の改行に変換
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        },
        'ragclub-admin',
      );
    return getAuth(app);
  } catch (e) {
    console.error('[firebaseAdmin] 初期化失敗（Firebase関連機能は無効）:', e instanceof Error ? e.message : e);
    return null;
  }
}

/** Firestore（サーバー専用）。環境変数未設定・初期化失敗時は null */
export function getAdminDb(): Firestore | null {
  try {
    const existing = getApps().find((a) => a.name === 'ragclub-admin');
    const app =
      existing ??
      initializeApp(
        {
          credential: cert({
            projectId:
              process.env.FIREBASE_PROJECT_ID ??
              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        },
        'ragclub-admin',
      );
    return getFirestore(app);
  } catch (e) {
    console.error('[firebaseAdmin] Firestore初期化失敗:', e instanceof Error ? e.message : e);
    return null;
  }
}
