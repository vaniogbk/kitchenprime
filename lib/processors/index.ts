import { prisma } from '@/lib/prisma';
import { createStripeCheckout } from './stripe';
import { createMollieCheckout } from './mollie';
import { createAdyenCheckout } from './adyen';
import { createSumUpCheckout } from './sumup';
import type { CheckoutParams, CheckoutResult, ProcessorName } from './types';
import type { IconName } from '@/components/ui/Icon';

export type { ProcessorName, CheckoutParams, CheckoutResult };

export const PROCESSORS: Record<ProcessorName, { label: string; icon: IconName; envKeys: string[] }> = {
  stripe: {
    label: 'Stripe',
    icon: 'stripe',
    envKeys: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
  },
  mollie: {
    label: 'Mollie',
    icon: 'm',
    envKeys: ['MOLLIE_API_KEY'],
  },
  adyen: {
    label: 'Adyen',
    icon: 'a',
    envKeys: ['ADYEN_API_KEY', 'ADYEN_MERCHANT_ACCOUNT', 'ADYEN_WEBHOOK_HMAC'],
  },
  sumup: {
    label: 'SumUp',
    icon: 's',
    envKeys: ['SUMUP_API_KEY', 'SUMUP_MERCHANT_CODE'],
  },
};

export async function getActiveProcessor(): Promise<ProcessorName> {
  try {
    const s = await prisma.setting.findUnique({ where: { key: 'activeProcessor' } });
    const val = s?.value as ProcessorName | undefined;
    if (val && val in PROCESSORS) return val;
  } catch {}
  return 'mollie';
}

export async function setActiveProcessor(name: ProcessorName) {
  await prisma.setting.upsert({
    where: { key: 'activeProcessor' },
    create: { key: 'activeProcessor', value: name },
    update: { value: name },
  });
}

export async function createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
  const processor = await getActiveProcessor();
  switch (processor) {
    case 'stripe': return createStripeCheckout(params);
    case 'mollie': return createMollieCheckout(params);
    case 'adyen': return createAdyenCheckout(params);
    case 'sumup': return createSumUpCheckout(params);
  }
}
