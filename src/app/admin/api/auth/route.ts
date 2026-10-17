import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { ADMIN_COOKIE, SESSION_MAX_AGE_SEC, createSessionToken } from '@/lib/adminSession';
import { clientIp, rateLimit } from '@/lib/rateLimit';

// ログイン試行は 1IPあたり 10分間に10回まで（総当たり対策）
const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 10 * 60_000;

// 長さが違っても同じ時間で比較できるよう、ハッシュ化してから定数時間で比較する
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

// POST: ログイン
export async function POST(request: NextRequest) {
  const rl = rateLimit(`admin-login:${clientIp(request)}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many attempts' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || typeof password !== 'string' || !safeEqual(password, expected)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  // Firebase Custom Token を生成（管理者共通の uid で識別）
  let firebaseToken: string | null = null;
  try {
    const adminAuth = getAdminAuth();
    if (adminAuth) {
      firebaseToken = await adminAuth.createCustomToken('ragclub-admin');
    } else {
      console.warn('[auth] Firebase Admin が初期化されていないため Custom Token をスキップ');
    }
  } catch (e) {
    console.error('[auth] Firebase custom token 生成失敗:', e);
    // 生成失敗でもセッションログインは通す（画像アップロードのみ影響）
  }

  const res = NextResponse.json({ ok: true, firebaseToken });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  });

  return res;
}

// DELETE: ログアウト（cookieを削除。署名付きトークンは個別には失効できないが、有効期限は1日）
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
