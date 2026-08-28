import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckoutForm } from '@/components/shop/CheckoutForm';
import { PRODUCTS, getProductBySlug } from '@/lib/products';
import { getProductContent } from '@/lib/product-content';
import { pageMetadata } from '@/lib/seo';
import { Icon } from '@/components/ui/Icon';
import { type CartCatalogEntry } from '@/components/shop/CartView';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/checkout',
    title: t('checkoutTitle'),
    description: t('checkoutDesc'),
    // Le tunnel de commande ne doit jamais remonter dans les résultats :
    // il n'a aucune valeur d'entrée et diluerait le budget d'exploration.
    noIndex: true,
  });
}

export default async function CheckoutPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { p?: string; qty?: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });

  const catalog: CartCatalogEntry[] = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: getProductContent(p.slug, locale).name,
    ref: p.ref,
    priceCents: p.priceCents,
    imageId: p.imageId,
  }));

  // `?p=slug` = achat direct depuis une fiche produit ; sans ce paramètre, on
  // facture le panier.
  const direct = searchParams.p ? getProductBySlug(searchParams.p) : undefined;
  const directLine = direct
    ? { slug: direct.slug, qty: Math.min(99, Math.max(1, Number(searchParams.qty) || 1)) }
    : null;

  return (
    <div className="checkout">
      <p
        style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '.12em',
          textTransform: 'uppercase', color: 'var(--copper)', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <Icon name="lock" /> {t('secure')}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
          fontSize: 26, fontWeight: 900, color: 'var(--ink)',
        }}
      >
        {t('title')}
      </h1>
      <CheckoutForm catalog={catalog} directLine={directLine} locale={locale} />
    </div>
  );
}
