export type ProcessorName = 'stripe' | 'mollie' | 'adyen' | 'sumup';

export interface CheckoutParams {
  orderId: string;
  amountCents: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  locale: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  paymentRef: string;
}
