import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTaxonomies } from '@/lib/shop/products';
import { createArtist, createTaxonomy, deleteTaxonomy, isTaxonomyKind, listArtists, parseArtistInput, parseName, renameTaxonomy, updateArtist } from '@/lib/shop/taxonomy';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');

export async function GET() {
  try {
    const [tax, artists] = await Promise.all([getTaxonomies(true), listArtists()]);
    // 管理画面専用: 作家は連絡先・手数料つきで返す（公開側のAPI/ページには出さない）
    return NextResponse.json({ categories: tax.categories, artists: artists ?? [] });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, name } = body;
    if (kind === 'artists') {
      const input = parseArtistInput(body);
      if (typeof input === 'string') return NextResponse.json({ error: input }, { status: 400 });
      return NextResponse.json({ id: await createArtist(input) }, { status: 201 });
    }
    const n = parseName(name);
    if (!isTaxonomyKind(kind) || !n) return NextResponse.json({ error: '名前は1〜100文字で入力してください' }, { status: 400 });
    return NextResponse.json({ id: await createTaxonomy(kind, n) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, id, name } = body;
    if (kind === 'artists') {
      const input = parseArtistInput(body);
      if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
      if (typeof input === 'string') return NextResponse.json({ error: input }, { status: 400 });
      await updateArtist(id, input);
      return NextResponse.json({ ok: true });
    }
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
