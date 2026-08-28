import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { CartView, type CartCatalogEntry } from '@/components/shop/CartView';
import { PRODUCTS } from '@/lib/products';
import { getProductContent } from '@/lib/product-content';
import { pageMetadata } from '@/lib/seo';
import { Icon } from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/panier',
    title: t('cartTitle'),
    description: t('cartDesc'),
    // Un panier est propre à un visiteur : rien à indexer.
    noIndex: true,
  });
}

export default async function CartPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'cart' });

  // Catalogue réduit et déjà traduit : le composant client n'a plus besoin
  // ni du module de contenu ni des messages produit.
  const catalog: CartCatalogEntry[] = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: getProductContent(p.slug, locale).name,
    ref: p.ref,
    priceCents: p.priceCents,
    imageId: p.imageId,
  }));

  return (
    <>
      <div className="page-head">
        <p className="page-eyebrow">
          <Icon name="bag-shopping" /> {t('eyebrow')}
        </p>
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-sub">{t('subtitle')}</p>
      </div>
      <div className="cart-page">
        <CartView catalog={catalog} locale={locale} />
      </div>
    </>
  );
}
