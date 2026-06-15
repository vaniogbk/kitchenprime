import type { CheckoutParams, CheckoutResult } from './types';

function cfg() {
  const apiKey = process.env.ADYEN_API_KEY;
  const merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT;
  const env = process.env.ADYEN_ENV ?? 'test';
  if (!apiKey) throw new Error('ADYEN_API_KEY missing');
  if (!merchantAccount) throw new Error('ADYEN_MERCHANT_ACCOUNT missing');
  const base = env === 'live'
    ? `https://checkout-live.adyen.com/checkout/v71`
    : `https://checkout-test.adyen.com/v71`;
  return { apiKey, merchantAccount, base };
}

export async function createAdyenCheckout(p: CheckoutParams): Promise<CheckoutResult> {
  const { apiKey, merchantAccount, base } = cfg();

  const res = await fetch(`${base}/paymentLinks`, {
    method: 'POST',
    headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: { value: p.amountCents, currency: p.currency },
      merchantAccount,
      reference: p.orderId,
      returnUrl: p.successUrl,
      description: p.description,
      shopperEmail: p.customerEmail,
      shopperLocale: p.locale === 'fr' ? 'fr-FR' : p.locale === 'de' ? 'de-DE' : p.locale === 'it' ? 'it-IT' : 'en-GB',
      metadata: { orderId: p.orderId },
    }),
  });
  if (!res.ok) throw new Error(`Adyen error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { checkoutUrl: data.url, paymentRef: data.id };
}

export function verifyAdyenWebhook(body: string, hmacKey: string, hmacValue: string): boolean {
  const crypto = require('crypto') as typeof import('crypto');
  const key = Buffer.from(hmacKey, 'hex');
  const expected = crypto.createHmac('sha256', key).update(body).digest('base64');
  return expected === hmacValue;
}
