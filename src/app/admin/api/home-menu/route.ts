import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getHomeSlides,
  createHomeSlide,
  updateHomeSlide,
  deleteHomeSlide,
} from '@/lib/notion';

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unknown error';
}

export async function GET() {
  try {
    const items = await getHomeSlides();
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const item = await createHomeSlide(data);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await updateHomeSlide(id, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await deleteHomeSlide(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
