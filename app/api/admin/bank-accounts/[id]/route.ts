import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateIban, validateBic, normalizeIban } from '@/lib/payment';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  const body = await req.json();
  const { label, holder, iban, bic, bank, isDefault, isActive } = body;

  // Si on définit ce compte comme défaut, on retire le flag des autres
  if (isDefault) {
    await prisma.bankAccount.updateMany({ data: { isDefault: false } });
  }

  if (iban !== undefined) {
    const check = validateIban(iban);
    if (!check.valid) {
      return NextResponse.json({ error: `IBAN invalide — ${check.reason}` }, { status: 400 });
    }
  }
  if (bic !== undefined && bic) {
    const check = validateBic(bic);
    if (!check.valid) return NextResponse.json({ error: check.reason }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (label !== undefined) updates.label = label.trim();
  if (holder !== undefined) updates.holder = holder.trim();
  if (iban !== undefined) updates.iban = normalizeIban(iban);
  if (bic !== undefined) updates.bic = bic ? bic.trim().toUpperCase() : null;
  if (bank !== undefined) updates.bank = bank ? bank.trim() : null;
  if (isDefault !== undefined) updates.isDefault = Boolean(isDefault);
  if (isActive !== undefined) updates.isActive = Boolean(isActive);

  const account = await prisma.bankAccount.update({
    where: { id: params.id },
    data: updates,
  });

  return NextResponse.json(account);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  await prisma.bankAccount.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
