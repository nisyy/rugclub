import { NextRequest, NextResponse } from 'next/server';

// 郵便番号 → 住所の検索（zipcloud）。ブラウザから外部APIを直接呼ばず、サーバー経由にする。
export async function GET(req: NextRequest) {
  const zip = (new URL(req.url).searchParams.get('zip') ?? '').replace(/-/g, '');
  if (!/^\d{7}$/.test(zip)) {
    return NextResponse.json({ ok: false, error: 'invalid_zip' }, { status: 400 });
  }
  try {
    const res = await fetch(`https://zipcloud.ibsnet.jp/api/search?zipcode=${zip}`, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    const data = (await res.json()) as {
      results: { address1: string; address2: string; address3: string }[] | null;
    };
    const r = data.results?.[0];
    if (!r) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    // address3（町域）が「以下に掲載がない場合」の場合は空にする
    const town = r.address3.includes('以下に掲載がない場合') ? '' : r.address3;
    return NextResponse.json({ ok: true, prefecture: r.address1, city: `${r.address2}${town}` });
  } catch (e) {
    console.error('[Shop postal] 検索失敗:', e instanceof Error ? `${e.name}: ${e.message}${e.cause ? ' / ' + String(e.cause) : ''}` : e);
    return NextResponse.json({ ok: false, error: 'lookup_failed' }, { status: 502 });
  }
}
