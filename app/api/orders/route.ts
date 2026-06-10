import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createMolliePayment } from '@/lib/mollie';
import { sendEmail } from '@/lib/email';

const OrderSchema = z.object({
  paymentMethod: z.enum(['card', 'wise']),
  locale: z.enum(['fr', 'de', 'it', 'en']).default('fr'),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(2),
  }),
  items: z
    .array(
      z.object({
        productSlug: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const slugs = data.items.map((i) => i.productSlug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, active: true },
  });
  if (products.length !== slugs.length) {
    return NextResponse.json({ error: 'Some products not found' }, { status: 400 });
  }

  let subtotal = 0;
  const itemRows = data.items.map((i) => {
    const prod = products.find((p) => p.slug === i.productSlug)!;
    const line = prod.priceCents * i.quantity;
    subtotal += line;
    return {
      productId: prod.id,
      nameAtSale: prod.name,
      refAtSale: prod.ref,
      priceCents: prod.priceCents,
      quantity: i.quantity,
    };
  });

  const order = await prisma.order.create({
    data: {
      paymentMethod: data.paymentMethod,
      subtotalCents: subtotal,
      shippingCents: 0,
      totalCents: subtotal,
      locale: data.locale,
      customerName: data.customer.name,
      customerEmail: data.customer.email,
      customerPhone: data.customer.phone,
      shippingAddress: data.customer.address,
      shippingCity: data.customer.city,
      shippingZip: data.customer.zip,
      shippingCountry: data.customer.country,
      items: { create: itemRows },
    },
  });

  // Card → Mollie redirect flow. Wise → manual instructions email.
  if (data.paymentMethod === 'card') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const payment = await createMolliePayment({
        amountCents: order.totalCents,
        description: `KitchenPrime order ${order.id}`,
        orderId: order.id,
        redirectUrl: `${baseUrl}/${data.locale}?orderId=${order.id}`,
        webhookUrl: `${baseUrl}/api/webhooks/mollie`,
        locale: data.locale === 'fr' ? 'fr_FR' : data.locale === 'de' ? 'de_DE' : data.locale === 'it' ? 'it_IT' : 'en_GB',
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentRef: payment.id },
      });
      return NextResponse.json({
        orderId: order.id,
        checkoutUrl: payment._links.checkout?.href,
      });
    } catch (err) {
      console.error('Mollie error:', err);
      return NextResponse.json({ error: 'Payment provider unavailable' }, { status: 502 });
    }
  }

  // Wise — send instructions email (best-effort)
  try {
    await sendEmail({
      to: data.customer.email,
      subject: `KitchenPrime — Virement bancaire Wise pour la commande #${order.id}`,
      html: `<p>Bonjour ${data.customer.name},</p>
             <p>Merci pour votre commande. Vous avez choisi le paiement par virement Wise.</p>
             <p>Référence de commande : <strong>${order.id}</strong></p>
             <p>Vous recevrez sous peu les coordonnées bancaires Wise. Pour toute question, écrivez-nous via WhatsApp au +33 7 80 96 73 39.</p>`,
    });
  } catch (err) {
    console.warn('Email send failed (non-blocking):', err);
  }

  return NextResponse.json({ orderId: order.id });
}
