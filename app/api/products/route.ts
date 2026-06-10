import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Category } from '@prisma/client';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cat = url.searchParams.get('category');
  const q = url.searchParams.get('q');

  const where: { active: boolean; category?: Category; name?: { contains: string } } = { active: true };
  if (cat && ['robots', 'acc', 'livres', 'packs'].includes(cat)) {
    where.category = cat as Category;
  }
  if (q) where.name = { contains: q };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ products });
}
