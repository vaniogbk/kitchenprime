import Stripe from 'stripe';
import type { CheckoutParams, CheckoutResult } from './types';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  return new Stripe(key);
}

export async function createStripeCheckout(p: CheckoutParams): Promise<CheckoutResult> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: p.customerEmail,
    line_items: [
      {
        price_data: {
          currency: p.currency.toLowerCase(),
          product_data: { name: p.description },
          unit_amount: p.amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: p.successUrl,
    cancel_url: p.cancelUrl,
    metadata: { orderId: p.orderId },
    payment_intent_data: {
      metadata: { orderId: p.orderId },
    },
  });

  if (!session.url) throw new Error('Stripe did not return a checkout URL');

  return { checkoutUrl: session.url, paymentRef: session.id };
}

export async function verifyStripeWebhook(body: string, signature: string): Promise<Stripe.Event> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET missing');
  return getStripe().webhooks.constructEvent(body, signature, secret);
}
