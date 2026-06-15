import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/processors/stripe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { generateReceiptPdf } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';

  let event;
  try {
    event = await verifyStripeWebhook(body, sig);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as unknown as { id: string; metadata: Record<string, string> };
    const orderId = session.metadata?.orderId;
    if (!orderId) return NextResponse.json({ ok: true });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order || order.status === 'paid') return NextResponse.json({ ok: true });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid', paymentRef: session.id },
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
               <p>Merci pour votre commande chez KitchenPrime. Votre paiement Stripe a bien été reçu.</p>
               <p>Vous trouverez votre facture en pièce jointe.</p>
               <p>Référence : <strong>${order.id}</strong></p>`,
        attachments: [{ filename: `facture-${order.id}.pdf`, content: pdf }],
      });
    } catch (err) {
      console.warn('Stripe receipt email failed:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
