import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createProduct, deleteProduct, listAllProducts, parseProductInput, updateProduct } from '@/lib/shop/products';

// /admin 配下は middleware で認証済み
const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');

export async function GET() {
  try {
    return NextResponse.json(await listAllProducts());
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = parseProductInput(await request.json());
    if (typeof input === 'string') return NextResponse.json({ error: input }, { status: 400 });
    const id = await createProduct(input);
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const input = parseProductInput(data);
    if (typeof input === 'string') return NextResponse.json({ error: input }, { status: 400 });
    await updateProduct(id, input);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
