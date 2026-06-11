import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { PDPGallery } from '@/components/shop/PDPGallery';
import { PDPActions } from '@/components/shop/PDPActions';
import { PRODUCTS, getProductBySlug, formatEUR } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

const localeMap: Record<Locale, string> = {
  fr: 'fr-FR', de: 'de-DE', it: 'it-IT', en: 'en-GB',
};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const p = getProductBySlug(params.slug);
  if (!p) return {};
  return { title: p.name, description: `${p.name} — ${formatEUR(p.priceCents)}` };
}

export default function ProductPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const gallery = [
    product.imageId,
    'KfouZ7nkiho',
    'xEZR4-kYhgM',
    'VghP75yXtWE',
  ];

  return (
    <div className="pdp">
      <Breadcrumb locale={locale} productName={product.name} />
      <div className="pdp-grid">
        <PDPGallery imageIds={gallery} alt={product.name} />
        <PDPDetails product={product} locale={locale} />
      </div>
    </div>
  );
}

function Breadcrumb({ locale, productName }: { locale: Locale; productName: string }) {
  const t = useTranslations('pdp');
  return (
    <div className="pdp-bread">
      <Link href={`/${locale}`}>{t('breadHome')}</Link>
      <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
      <Link href={`/${locale}/catalogue`}>{t('breadCatalog')}</Link>
      <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
      <span className="here">{productName}</span>
    </div>
  );
}

function PDPDetails({
  product,
  locale,
}: {
  product: ReturnType<typeof getProductBySlug>;
  locale: Locale;
}) {
  const t = useTranslations('pdp');
  const tCat = useTranslations('categories');
  if (!product) return null;
  const numLocale = localeMap[locale];
  const savings = product.oldPriceCents
    ? Math.round((product.oldPriceCents - product.priceCents) / 100)
    : 0;

  return (
    <div>
      <div className="pdp-cat">
        {tCat(product.category)} · Réf. {product.ref}
      </div>
      <div className="pdp-name">{product.name}</div>
      <div className="pdp-stars">
        <span className="si">
          {Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className="fa-solid fa-star" />
          ))}
        </span>
        <span>{product.rating.toFixed(1)}/5 · {t('reviewsCount', { count: product.reviewsCount })}</span>
      </div>
      <div className="pdp-price-box">
        <div className="pdp-price">{formatEUR(product.priceCents, numLocale)}</div>
        {product.oldPriceCents && (
          <div className="pdp-price-sub">
            <span className="pdp-old">{formatEUR(product.oldPriceCents, numLocale)}</span>
            <span className="pdp-saving">
              <i className="fa-solid fa-tag" /> {t('save', { amount: savings })}
            </span>
          </div>
        )}
      </div>
      {product.category === 'robots' && (
        <div className="pdp-feats">
          <div className="pdp-feat"><i className="fa-solid fa-check" /> {t('feat1')}</div>
          <div className="pdp-feat"><i className="fa-solid fa-check" /> {t('feat2')}</div>
          <div className="pdp-feat"><i className="fa-solid fa-check" /> {t('feat3')}</div>
          <div className="pdp-feat"><i className="fa-solid fa-check" /> {t('feat4')}</div>
        </div>
      )}
      <PDPActions
        productName={product.name}
        productSlug={product.slug}
        priceCents={product.priceCents}
        locale={locale}
      />
    </div>
  );
}
