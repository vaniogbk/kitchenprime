import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { WishlistView, type WishlistEntry } from '@/components/shop/WishlistView';
import { PRODUCTS, categoryIcon, formatEUR } from '@/lib/products';
import { getProductContent } from '@/lib/product-content';
import { badgeLabel } from '@/lib/catalog-view';
import { pageMetadata, BCP47 } from '@/lib/seo';
import { Icon } from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/favoris',
    title: t('wishlistTitle'),
    description: t('wishlistDesc'),
    // Liste propre au navigateur du visiteur : rien à indexer.
    noIndex: true,
  });
}

export default async function WishlistPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'wishlist' });
  const tBadges = await getTranslations({ locale, namespace: 'badges' });
  const tCat = await getTranslations({ locale, namespace: 'categories' });
  const numLocale = BCP47[locale];

  // Tout est traduit et formaté ici : le composant client n'a plus qu'à
  // filtrer sur les slugs enregistrés dans le navigateur.
  const entries: WishlistEntry[] = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: getProductContent(p.slug, locale).name,
    href: `/${locale}/produit/${p.slug}`,
    imageId: p.imageId,
    price: formatEUR(p.priceCents, numLocale),
    oldPrice: p.oldPriceCents ? formatEUR(p.oldPriceCents, numLocale) : null,
    rating: p.rating.toFixed(1),
    reviewsCount: p.reviewsCount,
    categoryLabel: tCat(p.category),
    categoryIcon: categoryIcon(p.category),
    badgeLabel: badgeLabel(p, tBadges),
    badgeClass:
      p.badge === 'new' ? 'b-new'
      : p.badge === 'pack' ? 'b-pack'
      : p.badge === 'copper' ? 'b-copper'
      : '',
  }));

  return (
    <>
      <div className="page-head">
        <p className="page-eyebrow">
          <Icon name="heart" /> {t('eyebrow')}
        </p>
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-sub">{t('subtitle')}</p>
      </div>
      <div className="wl-page">
        <WishlistView entries={entries} locale={locale} />
      </div>
    </>
  );
}
