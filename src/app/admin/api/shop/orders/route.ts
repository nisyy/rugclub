import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrder, listOrders, restoreStock, setSettlement, updateOrderFields, updateOrderStatus } from '@/lib/shop/orders';
import { sendShippedMail } from '@/lib/shop/orderMail';
import type { OrderStatus } from '@/lib/shop/types';

export const maxDuration = 60;

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');
const STATUSES: OrderStatus[] = ['received', 'packing', 'shipped', 'canceled'];
const CARRIERS = ['ヤマト運輸', '日本郵便', '佐川急便', 'その他'];

export async function GET() {
  try {
    return NextResponse.json(await listOrders());
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

// 更新: ステータス変更 / 発送情報（配送業者・追跡番号）＋発送通知 / 作家ごとの精算済みチェック
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    if (body.restoreStock === true) {
      const r = await restoreStock(id);
      return NextResponse.json({ ok: true, restored: r.restored });
    }

    if (body.settle) {
      const { artistId, settled } = body.settle;
      if (typeof artistId !== 'string' || !artistId || typeof settled !== 'boolean') return NextResponse.json({ error: 'invalid settle' }, { status: 400 });
      await setSettlement(id, artistId, settled);
      return NextResponse.json({ ok: true });
    }

    const status = body.status as OrderStatus;
    if (!STATUSES.includes(status)) return NextResponse.json({ error: 'invalid status' }, { status: 400 });

    if (status === 'shipped') {
      const carrier = typeof body.carrier === 'string' ? body.carrier : '';
      const trackingNumber = typeof body.trackingNumber === 'string' ? body.trackingNumber.trim().slice(0, 50) : '';
      if (!CARRIERS.includes(carrier)) return NextResponse.json({ error: '配送業者を選択してください' }, { status: 400 });
      if (!/^[0-9A-Za-z-]{4,50}$/.test(trackingNumber)) return NextResponse.json({ error: '追跡番号は英数字・ハイフン（4〜50文字）で入力してください' }, { status: 400 });
      const order = await getOrder(id);
      if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 });
      const fields = { status, carrier, trackingNumber, shippedAt: order.shippedAt ?? new Date().toISOString() };
      await updateOrderFields(id, fields);
      // 発送通知は初回のみ自動送信（再保存での二重送信を防ぐ）。notify=true の時だけ送る
      let mailResult = order.shippedMail ?? null;
      if (body.notify === true && order.shippedMail !== 'sent') {
        mailResult = await sendShippedMail({ ...order, ...fields });
        await updateOrderFields(id, { shippedMail: mailResult });
      }
      return NextResponse.json({ ok: true, shippedMail: mailResult });
    }

    await updateOrderStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
