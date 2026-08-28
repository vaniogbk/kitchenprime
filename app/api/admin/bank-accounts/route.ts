import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateIban, validateBic, normalizeIban } from '@/lib/payment';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  const accounts = await prisma.bankAccount.findMany({
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  const body = await req.json();
  const { label, holder, iban, bic, bank, isDefault } = body;

  if (!label || !holder || !iban) {
    return NextResponse.json({ error: 'label, holder et iban sont requis' }, { status: 400 });
  }

  // La boutique n'encaisse que par virement : un IBAN erroné n'échoue nulle
  // part, il envoie simplement l'argent des clients à côté.
  const ibanCheck = validateIban(iban);
  if (!ibanCheck.valid) {
    return NextResponse.json({ error: `IBAN invalide — ${ibanCheck.reason}` }, { status: 400 });
  }
  const bicCheck = validateBic(bic || '');
  if (!bicCheck.valid) {
    return NextResponse.json({ error: bicCheck.reason }, { status: 400 });
  }

  // Si ce compte devient le défaut, on retire le flag des autres
  if (isDefault) {
    await prisma.bankAccount.updateMany({ data: { isDefault: false } });
  }

  const account = await prisma.bankAccount.create({
    data: {
      label: label.trim(),
      holder: holder.trim(),
      iban: normalizeIban(iban),
      bic: bic ? bic.trim().toUpperCase() : null,
      bank: bank ? bank.trim() : null,
      isDefault: Boolean(isDefault),
      isActive: true,
    },
  });

  return NextResponse.json(account, { status: 201 });
}
