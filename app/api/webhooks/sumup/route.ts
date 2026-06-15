import { NextRequest, NextResponse } from 'next/server';
import { getSumUpCheckout } from '@/lib/processors/sumup';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { generateReceiptPdf } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const checkoutId = payload?.id ?? payload?.checkout_id;
  if (!checkoutId) return NextResponse.json({ ok: true });

  let checkout;
  try {
    checkout = await getSumUpCheckout(checkoutId);
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (checkout.status !== 'PAID') return NextResponse.json({ ok: true });

  // checkout_reference format: "KP-{orderId_first_16_chars}"
  const ref = checkout.checkout_reference ?? '';
  const orderId = ref.startsWith('KP-') ? ref.slice(3) : null;
  if (!orderId) return NextResponse.json({ ok: true });

  const order = await prisma.order.findFirst({
    where: { id: { startsWith: orderId } },
    include: { items: true },
  });
  if (!order || order.status === 'paid') return NextResponse.json({ ok: true });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'paid', paymentRef: checkoutId },
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
             <p>Merci pour votre commande. Votre paiement SumUp a bien été reçu.</p>
             <p>Vous trouverez votre facture en pièce jointe.</p>
             <p>Référence : <strong>${order.id}</strong></p>`,
      attachments: [{ filename: `facture-${order.id}.pdf`, content: pdf }],
    });
  } catch (err) {
    console.warn('SumUp receipt email failed:', err);
  }

  return NextResponse.json({ ok: true });
}
