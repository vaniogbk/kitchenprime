import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { PDPGallery } from '@/components/shop/PDPGallery';
import { PDPActions } from '@/components/shop/PDPActions';
import { ProductCard } from '@/components/shop/ProductCard';
import { PRODUCTS, getProductBySlug, formatEUR, savingsEuros } from '@/lib/products';
import { getProductContent } from '@/lib/product-content';
import { buildCardContent } from '@/lib/catalog-view';
import {
  pageMetadata,
  productLd,
  breadcrumbLd,
  jsonLdGraph,
  absoluteUrl,
  BCP47,
} from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { unsplashUrl } from '@/lib/products';
import { type Locale, locales } from '@/lib/i18n';

/** Visuels secondaires ajoutés à la galerie, communs à toutes les fiches. */
const EXTRA_SHOTS = [
  'photo-1585515320310-259814833e62',
  'photo-1591189863430-ab87e120f312',
  'photo-1565299624946-b28f40a0ae38',
];

export function generateStaticParams() {
  return locales.flatMap((locale) => PRODUCTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const product = getProductBySlug(slug);
  if (!product) return {};
  const c = getProductContent(slug, locale);
  return pageMetadata({
    locale,
    path: `/produit/${slug}`,
    title: c.name,
    description: c.tagline,
    image: unsplashUrl(product.imageId, 1200, 80),
    type: 'article',
  });
}

export default async function ProductPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: 'pdp' });
  const tCat = await getTranslations({ locale, namespace: 'categories' });
  const tBadges = await getTranslations({ locale, namespace: 'badges' });
  const content = getProductContent(slug, locale);
  const numLocale = BCP47[locale];

  // La photo du produit d'abord, puis des visuels d'ambiance — sans doublon.
  const gallery = [product.imageId, ...EXTRA_SHOTS.filter((id) => id !== product.imageId)];

  const related = PRODUCTS
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  const ld = jsonLdGraph(
    breadcrumbLd([
      { name: t('breadHome'), url: absoluteUrl(`/${locale}`) },
      { name: t('breadCatalog'), url: absoluteUrl(`/${locale}/catalogue`) },
      { name: content.name, url: absoluteUrl(`/${locale}/produit/${slug}`) },
    ]),
    productLd({
      name: content.name,
      description: content.tagline,
      sku: product.ref,
      slug: product.slug,
      brand: product.brand,
      image: gallery.map((id) => unsplashUrl(id, 1200, 80)),
      priceCents: product.priceCents,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      locale,
      category: tCat(product.category),
      condition: product.category === 'maison' ? 'new' : 'refurbished',
    }),
  );

  return (
    <div className="pdp">
      <nav className="pdp-bread" aria-label={t('breadCatalog')}>
        <Link href={`/${locale}`}>{t('breadHome')}</Link>
        <Icon name="chevron-right" style={{ fontSize: 9 }} />
        <Link href={`/${locale}/catalogue`}>{t('breadCatalog')}</Link>
        <Icon name="chevron-right" style={{ fontSize: 9 }} />
        <span className="here" aria-current="page">{content.name}</span>
      </nav>

      <div className="pdp-grid">
        <PDPGallery imageIds={gallery} alt={content.name} />

        <div>
          <p className="pdp-cat">
            {tCat(product.category)} · {t('brandLabel')} {product.brand} · {t('refLabel')} {product.ref}
          </p>
          <h1 className="pdp-name">{content.name}</h1>

          <p className="pdp-stars">
            <span className="si">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon name="star" key={i} />
              ))}
            </span>
            <span>
              {product.rating.toFixed(1)}/5 · {t('reviewsCount', { count: product.reviewsCount })}
            </span>
          </p>

          <div className="pdp-price-box">
            <p className="pdp-price">{formatEUR(product.priceCents, numLocale)}</p>
            {product.oldPriceCents && (
              <p className="pdp-price-sub">
                <span className="pdp-old">{formatEUR(product.oldPriceCents, numLocale)}</span>
                <span className="pdp-saving">
                  <Icon name="tag" /> {t('save', { amount: savingsEuros(product) })}
                </span>
              </p>
            )}
          </div>

          <PDPActions
            productName={content.name}
            productSlug={product.slug}
            priceCents={product.priceCents}
            locale={locale}
          />
        </div>
      </div>

      <section className="pdp-desc" aria-labelledby="desc-title">
        <h2 id="desc-title">{t('descriptionTitle')}</h2>
        {content.description.split('\n\n').map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}

        <h2>{t('featuresTitle')}</h2>
        <ul>
          {content.features.map((f) => (
            <li key={f}>
              <Icon name="check" /> {f}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ padding: '32px 0 0' }} aria-labelledby="related-title">
          <div className="sec-head">
            <h2 className="sec-title" id="related-title">{t('relatedTitle')}</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard
                key={p.slug}
                product={p}
                content={buildCardContent(p, locale, tBadges)}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      <JsonLd json={ld} />
    </div>
  );
}
