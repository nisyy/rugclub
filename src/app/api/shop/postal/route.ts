import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';

// 郵便番号 → 住所の検索。ブラウザから外部APIを直接呼ばず、サーバー経由にする。
// 検索先: zipcloud（第一）→ teraren（予備）。どちらかが住所を返せば成功とする。
// 1IPあたり 1分間に20回まで（超えたら429）
const LIMIT = 20;
const WINDOW_MS = 60_000;

type Found = { prefecture: string; city: string };

async function viaZipcloud(zip: string): Promise<Found | null | undefined> {
  const res = await fetch(`https://zipcloud.ibsnet.jp/api/search?zipcode=${zip}`, { signal: AbortSignal.timeout(5000), cache: 'no-store' });
  if (!res.ok) throw new Error(`zipcloud HTTP ${res.status}`);
  const data = (await res.json()) as { status?: number; message?: string | null; results: { address1: string; address2: string; address3: string }[] | null };
  if (data.status && data.status !== 200) throw new Error(`zipcloud status ${data.status}: ${data.message ?? ''}`);
  const r = data.results?.[0];
  if (!r) return null; // 該当なし
  const town = r.address3.includes('以下に掲載がない場合') ? '' : r.address3;
  return { prefecture: r.address1, city: `${r.address2}${town}` };
}

async function viaTeraren(zip: string): Promise<Found | null | undefined> {
  const res = await fetch(`https://postcode.teraren.com/postcodes/${zip}.json`, { signal: AbortSignal.timeout(5000), cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`teraren HTTP ${res.status}`);
  const d = (await res.json()) as { prefecture?: string; city?: string; suburb?: string };
  if (!d.prefecture) return null;
  const suburb = d.suburb && !d.suburb.includes('以下に掲載がない場合') ? d.suburb : '';
  return { prefecture: d.prefecture, city: `${d.city ?? ''}${suburb}` };
}

export async function GET(req: NextRequest) {
  const rl = rateLimit(`postal:${clientIp(req)}`, LIMIT, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } });
  }

  const zip = (new URL(req.url).searchParams.get('zip') ?? '').replace(/-/g, '');
  if (!/^\d{7}$/.test(zip)) {
    return NextResponse.json({ ok: false, error: 'invalid_zip' }, { status: 400 });
  }

  let reachable = false;
  for (const [name, lookup] of [['zipcloud', viaZipcloud], ['teraren', viaTeraren]] as const) {
    try {
      const found = await lookup(zip);
      reachable = true;
      if (found) return NextResponse.json({ ok: true, ...found });
      // 該当なしの場合は、もう一方でも確認する
    } catch (e) {
      console.error(`[Shop postal] ${name} 失敗:`, e instanceof Error ? `${e.name}: ${e.message}${e.cause ? ' / ' + String(e.cause) : ''}` : e);
    }
  }
  // どこかに接続できたが住所が無い＝該当なし。どこにも接続できない＝検索失敗
  return reachable
    ? NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
    : NextResponse.json({ ok: false, error: 'lookup_failed' }, { status: 502 });
}
