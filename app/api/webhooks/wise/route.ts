import { NextResponse } from 'next/server';

// Wise transfers are reconciled manually for now (per spec).
// This route exists so the URL can be configured later without redeploying.
export async function POST(req: Request) {
  try {
    const body = await req.text();
    console.log('[wise webhook] received:', body.slice(0, 500));
  } catch {}
  return NextResponse.json({ ok: true });
}
