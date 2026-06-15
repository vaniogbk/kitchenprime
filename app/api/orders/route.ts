import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createCheckout } from '@/lib/processors';
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
    .array(z.object({ productSlug: z.string(), quantity: z.number().int().positive() }))
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
  const products = await prisma.product.findMany({ where: { slug: { in: slugs }, active: true } });
  if (products.length !== slugs.length) {
    return NextResponse.json({ error: 'Some products not found' }, { status: 400 });
  }

  let subtotal = 0;
  const itemRows = data.items.map((i) => {
    const prod = products.find((p) => p.slug === i.productSlug)!;
    subtotal += prod.priceCents * i.quantity;
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

  if (data.paymentMethod === 'card') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const result = await createCheckout({
        orderId: order.id,
        amountCents: order.totalCents,
        currency: 'EUR',
        description: `KitchenPrime — commande ${order.id.slice(0, 8)}`,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        locale: data.locale,
        successUrl: `${baseUrl}/${data.locale}?orderId=${order.id}&paid=1`,
        cancelUrl: `${baseUrl}/${data.locale}/checkout?cancelled=1`,
        webhookUrl: `${baseUrl}/api/webhooks/${await import('@/lib/processors').then(m => m.getActiveProcessor())}`,
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentRef: result.paymentRef },
      });
      return NextResponse.json({ orderId: order.id, checkoutUrl: result.checkoutUrl });
    } catch (err) {
      console.error('Payment processor error:', err);
      return NextResponse.json({ error: 'Payment provider unavailable' }, { status: 502 });
    }
  }

  // Virement — email de confirmation avec IBAN
  try {
    const bankAccount = await prisma.bankAccount.findFirst({
      where: { isDefault: true, isActive: true },
      select: { holder: true, iban: true, bic: true, bank: true },
    }).then(a => a ?? prisma.bankAccount.findFirst({ where: { isActive: true }, select: { holder: true, iban: true, bic: true, bank: true } }));

    const ibanBlock = bankAccount
      ? `<table style="font-size:14px;border-collapse:collapse;margin:12px 0">
           <tr><td style="color:#666;padding:3px 12px 3px 0">Bénéficiaire</td><td><strong>${bankAccount.holder}</strong></td></tr>
           ${bankAccount.bank ? `<tr><td style="color:#666;padding:3px 12px 3px 0">Banque</td><td>${bankAccount.bank}</td></tr>` : ''}
           <tr><td style="color:#666;padding:3px 12px 3px 0">IBAN</td><td><code>${bankAccount.iban.replace(/(.{4})/g, '$1 ').trim()}</code></td></tr>
           ${bankAccount.bic ? `<tr><td style="color:#666;padding:3px 12px 3px 0">BIC</td><td><code>${bankAccount.bic}</code></td></tr>` : ''}
         </table>`
      : '<p>Les coordonnées bancaires vous seront envoyées séparément.</p>';

    await sendEmail({
      to: data.customer.email,
      subject: `KitchenPrime — Coordonnées pour votre virement #${order.id.slice(0, 8)}`,
      html: `<p>Bonjour ${data.customer.name},</p>
             <p>Merci pour votre commande chez KitchenPrime.</p>
             <p>Pour finaliser votre commande, merci d'effectuer un virement de <strong>${(order.totalCents / 100).toFixed(2)} €</strong> sur le compte suivant :</p>
             ${ibanBlock}
             <p>Indiquez comme référence : <strong>${order.id}</strong></p>
             <p>Nous expédions votre colis dès réception du virement (généralement 1-2 jours ouvrés).</p>`,
    });
  } catch (err) {
    console.warn('Virement email failed (non-blocking):', err);
  }

  return NextResponse.json({ orderId: order.id });
}
