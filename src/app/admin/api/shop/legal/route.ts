import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLegalSettings, missingLegalFields, parseLegalSettings, saveLegalSettings } from '@/lib/shop/legal';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');

export async function GET() {
  try {
    const settings = await getLegalSettings();
    return NextResponse.json({ settings, missing: missingLegalFields(settings) });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const parsed = parseLegalSettings(await request.json());
    if (typeof parsed === 'string') return NextResponse.json({ error: parsed }, { status: 400 });
    await saveLegalSettings(parsed);
    return NextResponse.json({ ok: true, missing: missingLegalFields(parsed) });
  } catch (e) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
