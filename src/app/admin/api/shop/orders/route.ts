import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { listOrders, updateOrderStatus } from '@/lib/shop/orders';
import type { OrderStatus } from '@/lib/shop/types';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');

export async function GET() {
  try {
    return NextResponse.json(await listOrders());
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    if (!['received', 'shipped', 'canceled'].includes(status)) return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    await updateOrderStatus(id, status as OrderStatus);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
