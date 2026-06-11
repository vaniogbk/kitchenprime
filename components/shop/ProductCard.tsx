'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  type Product,
  categoryIcon,
  formatEUR,
  unsplashUrl,
} from '@/lib/products';
import { waOrderUrl } from '@/lib/whatsapp';
import { type Locale } from '@/lib/i18n';

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = useTranslations();
  const tWa = useTranslations('wa');
  const localeMap: Record<Locale, string> = {
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    en: 'en-GB',
  };
  const numLocale = localeMap[locale];

  const badgeClass =
    product.badge === 'new' ? 'b-new'
    : product.badge === 'pack' ? 'b-pack'
    : product.badge === 'copper' ? 'b-copper'
    : '';

  const catLabel = t(`categories.${product.category}`);
  const href = `/${locale}/produit/${product.slug}`;

  return (
    <Link href={href} className="pcard">
      <div className="pcard-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplashUrl(product.imageId, 500, 75)} alt={product.name} />
        {product.badge && product.badgeLabel && (
          <div className={`pbadge ${badgeClass}`}>{product.badgeLabel}</div>
        )}
        <button
          type="button"
          className="pwish"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label="wishlist"
        >
          <i className="fa-regular fa-heart" />
        </button>
      </div>
      <div className="pbody">
        <div className="pcat">
          <i className={`fa-solid ${categoryIcon(product.category)}`} /> {catLabel}
        </div>
        <div className="pname">{product.name}</div>
        <div className="pstars">
          <i className="fa-solid fa-star" />
          <span>{product.rating.toFixed(1)} ({product.reviewsCount})</span>
        </div>
        <div className="pprice-row">
          <span className="pprice">{formatEUR(product.priceCents, numLocale)}</span>
          {product.oldPriceCents && (
            <span className="pold">{formatEUR(product.oldPriceCents, numLocale)}</span>
          )}
        </div>
        <div className="pactions">
          <button
            type="button"
            className="pbtn-buy"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/${locale}/checkout?p=${product.slug}`;
            }}
          >
            <i className="fa-solid fa-cart-plus" /> {t('catalog.add')}
          </button>
          <a
            href={waOrderUrl(product.name, tWa.raw('msg') as string)}
            target="_blank"
            rel="noopener noreferrer"
            className="pbtn-wa"
            onClick={(e) => e.stopPropagation()}
            aria-label="WhatsApp"
          >
            <i className="fa-brands fa-whatsapp" />
          </a>
        </div>
      </div>
    </Link>
  );
}
