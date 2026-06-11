export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '33756976502';

export function waOrderUrl(product: string, template?: string) {
  const msg = (template ?? 'Bonjour KitchenPrime, je souhaite commander : {product}').replace('{product}', product);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
