import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTaxonomies } from '@/lib/shop/products';
import { createTaxonomy, deleteTaxonomy, isTaxonomyKind, parseName, renameTaxonomy } from '@/lib/shop/taxonomy';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');

export async function GET() {
  try {
    return NextResponse.json(await getTaxonomies(true));
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { kind, name } = await request.json();
    const n = parseName(name);
    if (!isTaxonomyKind(kind) || !n) return NextResponse.json({ error: '名前は1〜100文字で入力してください' }, { status: 400 });
    return NextResponse.json({ id: await createTaxonomy(kind, n) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { kind, id, name } = await request.json();
    const n = parseName(name);
    if (!isTaxonomyKind(kind) || typeof id !== 'string' || !id || !n) return NextResponse.json({ error: '入力が正しくありません' }, { status: 400 });
    await renameTaxonomy(kind, id, n);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sp = new URL(request.url).searchParams;
    const kind = sp.get('kind');
    const id = sp.get('id');
    if (!isTaxonomyKind(kind) || !id) return NextResponse.json({ error: '入力が正しくありません' }, { status: 400 });
    await deleteTaxonomy(kind, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
