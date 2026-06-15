import { NextRequest, NextResponse } from 'next/server';
import { verifyAdyenWebhook } from '@/lib/processors/adyen';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { generateReceiptPdf } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const hmacKey = process.env.ADYEN_WEBHOOK_HMAC ?? '';
  const hmacValue = req.headers.get('hmacSignature') ?? '';

  if (hmacKey && hmacValue && !verifyAdyenWebhook(body, hmacKey, hmacValue)) {
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const items = payload?.notificationItems ?? [];
  for (const item of items) {
    const n = item?.NotificationRequestItem;
    if (!n) continue;

    if (n.eventCode === 'AUTHORISATION' && n.success === 'true') {
      const orderId = n.merchantReference;
      if (!orderId) continue;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.status === 'paid') continue;

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid', paymentRef: n.pspReference },
      });

      try {
        const pdf = await generateReceiptPdf({
          orderId: order.id,
          date: new Date(),
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            address: order.shippingAddress,
            city: order.shippingCity,
            zip: order.shippingZip,
            country: order.shippingCountry,
          },
          items: order.items.map((it) => ({
            name: it.nameAtSale,
            ref: it.refAtSale,
            qty: it.quantity,
            priceCents: it.priceCents,
          })),
          subtotalCents: order.subtotalCents,
          shippingCents: order.shippingCents,
          totalCents: order.totalCents,
        });

        await sendEmail({
          to: order.customerEmail,
          subject: `KitchenPrime — Confirmation de commande #${order.id}`,
          html: `<p>Bonjour ${order.customerName},</p>
                 <p>Merci pour votre commande. Votre paiement Adyen a bien été reçu.</p>
                 <p>Vous trouverez votre facture en pièce jointe.</p>
                 <p>Référence : <strong>${order.id}</strong></p>`,
          attachments: [{ filename: `facture-${order.id}.pdf`, content: pdf }],
        });
      } catch (err) {
        console.warn('Adyen receipt email failed:', err);
      }
    }
  }

  return NextResponse.json({ notificationResponse: '[accepted]' });
}
