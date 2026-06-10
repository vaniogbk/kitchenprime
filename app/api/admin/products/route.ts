import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ products });
}

export async function PATCH(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug, priceCents, oldPriceCents, active, badge, badgeLabel } = await req.json();
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
  const updated = await prisma.product.update({
    where: { slug },
    data: { priceCents, oldPriceCents, active, badge, badgeLabel },
  });
  return NextResponse.json({ product: updated });
}
