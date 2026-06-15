import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint — retourne uniquement le compte par défaut actif pour l'afficher au checkout
export async function GET() {
  const account = await prisma.bankAccount.findFirst({
    where: { isDefault: true, isActive: true },
    select: { id: true, label: true, holder: true, iban: true, bic: true, bank: true },
  });

  if (!account) {
    // Fallback : premier compte actif
    const fallback = await prisma.bankAccount.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, label: true, holder: true, iban: true, bic: true, bank: true },
    });
    return NextResponse.json(fallback ?? null);
  }

  return NextResponse.json(account);
}
