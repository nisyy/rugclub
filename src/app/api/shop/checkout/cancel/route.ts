import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { findOrderBySessionId, releaseOrder } from '@/lib/shop/orders';
import { getStripe, isPaymentConnected } from '@/lib/shop/payment';

// 購入者が決済ページから「戻る」を選んだ時に、確保していた在庫をすぐ解放する。
// 決済待ちの注文にだけ作用する（支払い済みの注文は変更されない）。
export async function POST(req: NextRequest) {
  const rl = rateLimit(`checkout-cancel:${clientIp(req)}`, 20, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });

  const { sessionId } = (await req.json().catch(() => ({}))) as { sessionId?: unknown };
  if (typeof sessionId !== 'string' || !/^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId)) {
    return NextResponse.json({ ok: false, error: 'invalid_session' }, { status: 400 });
  }
  try {
    const order = await findOrderBySessionId(sessionId);
    if (!order || order.status !== 'pending_payment') return NextResponse.json({ ok: true, released: false });
    if (isPaymentConnected()) await getStripe().checkout.sessions.expire(sessionId).catch(() => {}); // 支払い済み等で失敗しても続行
    // 念のためStripe側で支払い済みでないことを確認してから解放する
    const session = isPaymentConnected() ? await getStripe().checkout.sessions.retrieve(sessionId).catch(() => null) : null;
    if (session?.payment_status === 'paid') return NextResponse.json({ ok: true, released: false });
    return NextResponse.json({ ok: true, released: await releaseOrder(order.id) });
  } catch (e) {
    console.error('[Shop] 決済キャンセル処理に失敗:', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: 'cancel_failed' }, { status: 502 });
  }
}
