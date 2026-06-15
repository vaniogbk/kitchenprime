import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getActiveProcessor, setActiveProcessor, PROCESSORS } from '@/lib/processors';
import type { ProcessorName } from '@/lib/processors';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  const active = await getActiveProcessor();
  return NextResponse.json({ active, processors: PROCESSORS });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  const { activeProcessor } = await req.json();
  if (!activeProcessor || !(activeProcessor in PROCESSORS)) {
    return NextResponse.json({ error: 'Invalid processor' }, { status: 400 });
  }

  await setActiveProcessor(activeProcessor as ProcessorName);
  return NextResponse.json({ active: activeProcessor });
}
