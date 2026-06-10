import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMolliePayment } from '@/lib/mollie';
import { sendEmail } from '@/lib/email';
import { generateReceiptPdf } from '@/lib/pdf';
import type { OrderStatus } from '@prisma/client';

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get('id');
  if (typeof id !== 'string') return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const payment = await getMolliePayment(id);
    const order = await prisma.order.findUnique({
      where: { paymentRef: id },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ ok: true });

    let newStatus: OrderStatus = order.status;
    if (payment.status === 'paid') newStatus = 'paid';
    else if (payment.status === 'canceled' || payment.status === 'expired' || payment.status === 'failed') newStatus = 'cancelled';

    if (newStatus !== order.status) {
      await prisma.order.update({ where: { id: order.id }, data: { status: newStatus } });
    }

    if (newStatus === 'paid' && order.status !== 'paid') {
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
                 <p>Merci pour votre commande chez KitchenPrime. Votre paiement a bien été reçu.</p>
                 <p>Vous trouverez votre facture en pièce jointe.</p>
                 <p>Référence : <strong>${order.id}</strong></p>`,
          attachments: [{ filename: `facture-${order.id}.pdf`, content: pdf }],
        });
      } catch (err) {
        console.warn('Receipt email failed (non-blocking):', err);
      }
    }
  } catch (err) {
    console.error('Mollie webhook error:', err);
  }

  return NextResponse.json({ ok: true });
}
