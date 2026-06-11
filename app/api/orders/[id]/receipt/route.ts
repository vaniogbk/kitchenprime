import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReceiptPdf } from '@/lib/pdf';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const pdf = await generateReceiptPdf({
    orderId: order.id,
    date: order.createdAt,
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

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${order.id}.pdf"`,
    },
  });
}
