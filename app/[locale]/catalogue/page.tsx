import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { CatalogGrid, type CatalogItem } from '@/components/shop/CatalogGrid';
import { PRODUCTS, type Category } from '@/lib/products';
import { getProductContent } from '@/lib/product-content';
import { buildCardContent } from '@/lib/catalog-view';
import {
  pageMetadata,
  itemListLd,
  breadcrumbLd,
  jsonLdGraph,
  absoluteUrl,
} from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';

const VALID_CATS = ['robots', 'acc', 'livres', 'packs', 'maison'] as const;

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/catalogue',
    title: t('catalogTitle'),
    description: t('catalogDesc'),
  });
}

export default async function CatalogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { q?: string; cat?: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'catalog' });
  const tBadges = await getTranslations({ locale, namespace: 'badges' });
  const tPdp = await getTranslations({ locale, namespace: 'pdp' });

  const filter: 'all' | Category = VALID_CATS.includes(searchParams.cat as Category)
    ? (searchParams.cat as Category)
    : 'all';

  const items: CatalogItem[] = PRODUCTS.map((product) => ({
    product,
    content: buildCardContent(product, locale, tBadges),
  }));

  const ld = jsonLdGraph(
    breadcrumbLd([
      { name: tPdp('breadHome'), url: absoluteUrl(`/${locale}`) },
      { name: tPdp('breadCatalog'), url: absoluteUrl(`/${locale}/catalogue`) },
    ]),
    itemListLd(
      PRODUCTS.map((p) => ({
        name: getProductContent(p.slug, locale).name,
        url: absoluteUrl(`/${locale}/produit/${p.slug}`),
      })),
      t('title'),
    ),
  );

  return (
    <>
      <div className="page-head">
        <p className="page-eyebrow">
          <Icon name="table-cells-large" /> {t('eyebrow')}
        </p>
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-sub">{t('subtitle')}</p>
      </div>
      <CatalogGrid items={items} locale={locale} filter={filter} query={searchParams.q} />
      <JsonLd json={ld} />
    </>
  );
}
