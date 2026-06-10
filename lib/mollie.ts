// Lightweight Mollie REST client (no SDK dep) — uses native fetch.
// Replace stubs with proper error handling per Mollie docs:
// https://docs.mollie.com/reference/v2/payments-api/create-payment

const MOLLIE_API = 'https://api.mollie.com/v2';

function mollieKey() {
  const k = process.env.MOLLIE_API_KEY;
  if (!k) throw new Error('MOLLIE_API_KEY missing');
  return k;
}

export type MolliePayment = {
  id: string;
  status: string;
  amount: { value: string; currency: string };
  _links: { checkout?: { href: string } };
};

export async function createMolliePayment(args: {
  amountCents: number;
  description: string;
  orderId: string;
  redirectUrl: string;
  webhookUrl: string;
  locale?: string;
}): Promise<MolliePayment> {
  const body = {
    amount: {
      currency: 'EUR',
      value: (args.amountCents / 100).toFixed(2),
    },
    description: args.description,
    redirectUrl: args.redirectUrl,
    webhookUrl: args.webhookUrl,
    metadata: { orderId: args.orderId },
    locale: args.locale ?? 'fr_FR',
  };

  const res = await fetch(`${MOLLIE_API}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mollieKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Mollie create payment failed: ${res.status}`);
  return res.json();
}

export async function getMolliePayment(id: string): Promise<MolliePayment> {
  const res = await fetch(`${MOLLIE_API}/payments/${id}`, {
    headers: { Authorization: `Bearer ${mollieKey()}` },
  });
  if (!res.ok) throw new Error(`Mollie get payment failed: ${res.status}`);
  return res.json();
}
