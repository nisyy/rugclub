import { NextRequest, NextResponse } from 'next/server';
import { priceCart, sanitizeLines } from '@/lib/shop/pricing';

// 商品ID＋数量だけを受け取り、価格・在庫・販売状態をサーバー側で再計算して返す
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const lines = sanitizeLines((body as { lines?: unknown })?.lines);
  const cart = await priceCart(lines);
  return NextResponse.json({ ok: true, cart });
}
