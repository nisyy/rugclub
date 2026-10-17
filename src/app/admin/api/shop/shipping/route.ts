import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getShippingSettings, parseShippingSettings, saveShippingSettings } from '@/lib/shop/shipping';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');

export async function GET() {
  try {
    return NextResponse.json(await getShippingSettings());
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const parsed = parseShippingSettings(await request.json());
    if (typeof parsed === 'string') return NextResponse.json({ error: parsed }, { status: 400 });
    await saveShippingSettings(parsed);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
