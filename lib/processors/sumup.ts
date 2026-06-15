import type { CheckoutParams, CheckoutResult } from './types';

const SUMUP_API = 'https://api.sumup.com/v0.1';

function key() {
  const k = process.env.SUMUP_API_KEY;
  if (!k) throw new Error('SUMUP_API_KEY missing');
  return k;
}

export async function createSumUpCheckout(p: CheckoutParams): Promise<CheckoutResult> {
  const ref = `KP-${p.orderId.slice(0, 16)}`;

  const res = await fetch(`${SUMUP_API}/checkouts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkout_reference: ref,
      amount: (p.amountCents / 100).toFixed(2),
      currency: p.currency,
      description: p.description,
      return_url: p.successUrl,
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
    }),
  });
  if (!res.ok) throw new Error(`SumUp error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const checkoutUrl = `https://pay.sumup.com/b2c/${data.id}`;
  return { checkoutUrl, paymentRef: data.id };
}

export async function getSumUpCheckout(id: string) {
  const res = await fetch(`${SUMUP_API}/checkouts/${id}`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(`SumUp get error ${res.status}`);
  return res.json() as Promise<{ id: string; status: string; checkout_reference: string }>;
}
