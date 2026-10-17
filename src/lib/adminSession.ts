// 管理画面のセッション。パスワードをcookieに入れず、署名付きトークン（HMAC-SHA256）を使う。
// Web Crypto のみ使用するので、middleware(Edge)・Route Handler(Node) のどちらでも動く。
// トークン形式: <有効期限(ms)>.<ランダム値>.<署名>
export const ADMIN_COOKIE = 'admin_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24; // 1日

const enc = new TextEncoder();

function secret(): string | null {
  // 専用の秘密鍵を推奨。未設定の間は ADMIN_PASSWORD から鍵を導出する（署名からパスワードは復元できない）
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function toB64Url(buf: ArrayBuffer): string {
  let s = '';
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s: string): Uint8Array<ArrayBuffer> | null {
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    const out = new Uint8Array(new ArrayBuffer(bin.length));
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

async function hmacKey(usage: 'sign' | 'verify'): Promise<CryptoKey | null> {
  const k = secret();
  if (!k) return null;
  return crypto.subtle.importKey('raw', enc.encode(k), { name: 'HMAC', hash: 'SHA-256' }, false, [usage]);
}

export async function createSessionToken(now = Date.now()): Promise<string | null> {
  const key = await hmacKey('sign');
  if (!key) return null;
  const nonce = toB64Url(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const payload = `${now + SESSION_MAX_AGE_SEC * 1000}.${nonce}`;
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return `${payload}.${toB64Url(sig)}`;
}

/** 署名が正しく、有効期限内なら true（署名の比較は crypto.subtle.verify＝定数時間） */
export async function verifySessionToken(token: string | undefined | null, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || expMs <= now || expMs > now + SESSION_MAX_AGE_SEC * 1000 + 60_000) return false;
  const sigBytes = fromB64Url(sig);
  const key = await hmacKey('verify');
  if (!sigBytes || !key) return false;
  return crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${exp}.${nonce}`));
}
