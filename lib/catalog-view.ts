import { type Product, savingsEuros } from './products';
import { getProductContent } from './product-content';
import type { Locale } from './i18n';
import type { CardContent } from '@/components/shop/ProductCard';

/** Signature minimale de la fonction `t` de next-intl pour le namespace `badges`. */
type BadgeT = (key: string, values?: Record<string, string | number>) => string;

/**
 * Libellé de badge traduit.
 *
 * Le montant d'un badge « pack » est recalculé depuis les prix plutôt que
 * saisi en dur : un changement de tarif ne peut plus laisser un « −68 € »
 * périmé sur la vignette.
 */
export function badgeLabel(product: Product, t: BadgeT): string {
  switch (product.badgeKey) {
    case 'new': return t('new');
    case 'promo': return t('promo');
    case 'bestseller': return t('bestseller');
    case 'pack': return t('pack', { amount: savingsEuros(product) });
    default: return '';
  }
}

/** Contenu localisé d'une vignette produit. */
export function buildCardContent(product: Product, locale: Locale, t: BadgeT): CardContent {
  return {
    name: getProductContent(product.slug, locale).name,
    badgeLabel: badgeLabel(product, t),
  };
}
