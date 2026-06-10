import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { OrderStatus } from '@prisma/client';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}

export async function GET(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const status = url.searchParams.get('status') as OrderStatus | null;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  return NextResponse.json({ orders });
}

export async function PATCH(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });
  const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }
  const updated = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ order: updated });
}
