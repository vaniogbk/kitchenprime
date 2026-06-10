import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/shop/Hero';
import { TrustStrip } from '@/components/shop/TrustStrip';
import { ProductCard } from '@/components/shop/ProductCard';
import { Testimonials } from '@/components/shop/Testimonials';
import { PRODUCTS } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  const popular = [
    PRODUCTS.find((p) => p.slug === 'thermomix-tm7')!,
    PRODUCTS.find((p) => p.slug === 'pack-tm7-complet')!,
    PRODUCTS.find((p) => p.slug === 'varoma-xl-steam-set')!,
  ];

  return (
    <>
      <Hero locale={locale} />
      <TrustStrip />
      <PopularSection locale={locale} products={popular} />
      <Testimonials />
    </>
  );
}

function PopularSection({ locale, products }: { locale: Locale; products: typeof PRODUCTS }) {
  const t = useTranslations('home');
  return (
    <div className="section">
      <div className="sec-head">
        <div>
          <div className="sec-eyebrow"><i className="fa-solid fa-star" /> {t('popularEyebrow')}</div>
          <div className="sec-title">{t('popularTitle')}</div>
        </div>
        <Link href={`/${locale}/catalogue`} className="see-all">
          {t('seeAll')} <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}
