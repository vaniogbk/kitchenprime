import { NextResponse } from 'next/server';

// Server-side notification via WhatsApp Cloud API.
// UI uses wa.me direct links; this endpoint is for ops/admin use.
export async function POST(req: Request) {
  const { to, message } = await req.json();
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    return NextResponse.json({ error: 'WhatsApp Cloud API not configured' }, { status: 503 });
  }
  if (!to || !message) {
    return NextResponse.json({ error: 'Missing to or message' }, { status: 400 });
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });
    const data = await res.json();
    return NextResponse.json({ ok: res.ok, data });
  } catch (err) {
    return NextResponse.json({ error: 'WhatsApp send failed', detail: String(err) }, { status: 502 });
  }
}
