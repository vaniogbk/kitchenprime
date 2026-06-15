import type { CheckoutParams, CheckoutResult } from './types';

const MOLLIE_API = 'https://api.mollie.com/v2';

function key() {
  const k = process.env.MOLLIE_API_KEY;
  if (!k) throw new Error('MOLLIE_API_KEY missing');
  return k;
}

const LOCALE_MAP: Record<string, string> = {
  fr: 'fr_FR', de: 'de_DE', it: 'it_IT', en: 'en_GB',
};

export async function createMollieCheckout(p: CheckoutParams): Promise<CheckoutResult> {
  const res = await fetch(`${MOLLIE_API}/payments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: { currency: p.currency, value: (p.amountCents / 100).toFixed(2) },
      description: p.description,
      redirectUrl: p.successUrl,
      webhookUrl: p.webhookUrl,
      locale: LOCALE_MAP[p.locale] ?? 'fr_FR',
      metadata: { orderId: p.orderId },
    }),
  });
  if (!res.ok) throw new Error(`Mollie error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { checkoutUrl: data._links.checkout.href, paymentRef: data.id };
}

export async function getMolliePayment(id: string) {
  const res = await fetch(`${MOLLIE_API}/payments/${id}`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(`Mollie get error ${res.status}`);
  return res.json() as Promise<{ id: string; status: string; metadata: { orderId: string } }>;
}
