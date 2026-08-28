import Link from 'next/link';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/shop/Hero';
import { TrustStrip } from '@/components/shop/TrustStrip';
import { ProductCard } from '@/components/shop/ProductCard';
import { Testimonials } from '@/components/shop/Testimonials';
import { PRODUCTS } from '@/lib/products';
import { getProductContent } from '@/lib/product-content';
import { buildCardContent } from '@/lib/catalog-view';
import { itemListLd, jsonLdGraph, absoluteUrl, pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';

const POPULAR = ['thermomix-tm7', 'pack-tm7-complet', 'samsung-family-hub'];

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/',
    title: t('homeTitle'),
    description: t('homeDesc'),
  });
}

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const tBadges = await getTranslations({ locale, namespace: 'badges' });

  const popular = POPULAR
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

  const ld = itemListLd(
    popular.map((p) => ({
      name: getProductContent(p.slug, locale).name,
      url: absoluteUrl(`/${locale}/produit/${p.slug}`),
    })),
    t('popularTitle'),
  );

  return (
    <>
      <Hero locale={locale} />
      <TrustStrip />

      <section className="section" aria-labelledby="popular-title">
        <div className="sec-head">
          <div>
            <p className="sec-eyebrow"><Icon name="star" /> {t('popularEyebrow')}</p>
            <h2 className="sec-title" id="popular-title">{t('popularTitle')}</h2>
          </div>
          <Link href={`/${locale}/catalogue`} className="see-all">
            {t('seeAll')} <Icon name="arrow-right" />
          </Link>
        </div>
        <div className="grid">
          {popular.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              content={buildCardContent(p, locale, tBadges)}
              locale={locale}
              eager={i === 0}
            />
          ))}
        </div>
      </section>

      <Testimonials />
      <JsonLd json={jsonLdGraph(ld)} />
    </>
  );
}
