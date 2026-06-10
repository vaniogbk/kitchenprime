'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { waOrderUrl } from '@/lib/whatsapp';
import { formatEUR } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

const localeMap: Record<Locale, string> = {
  fr: 'fr-FR', de: 'de-DE', it: 'it-IT', en: 'en-GB',
};

export function PDPActions({
  productName,
  productSlug,
  priceCents,
  locale,
}: {
  productName: string;
  productSlug: string;
  priceCents: number;
  locale: Locale;
}) {
  const t = useTranslations('pdp');
  const tWa = useTranslations('wa');
  const [qty, setQty] = useState(1);
  const total = priceCents * qty;

  return (
    <>
      <div className="qty">
        <span className="qty-label">{t('qty')}</span>
        <div className="qty-ctrl">
          <button type="button" className="qbtn" onClick={() => setQty(Math.max(1, qty - 1))}>
            <i className="fa-solid fa-minus" style={{ fontSize: 10 }} />
          </button>
          <span className="qval">{qty}</span>
          <button type="button" className="qbtn" onClick={() => setQty(qty + 1)}>
            <i className="fa-solid fa-plus" style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>
      <div className="pdp-cta">
        <button
          type="button"
          className="btn-buy"
          style={{ width: '100%', padding: 14 }}
          onClick={() => {
            window.location.href = `/${locale}/checkout?p=${productSlug}&qty=${qty}`;
          }}
        >
          <i className="fa-solid fa-bag-shopping" /> {t('addToCart')} · {formatEUR(total, localeMap[locale])}
        </button>
        <a
          href={waOrderUrl(productName, tWa('msg'))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa"
          style={{ width: '100%', padding: 14 }}
        >
          <i className="fa-brands fa-whatsapp" style={{ fontSize: 16 }} /> {t('orderWa')}
        </a>
      </div>
    </>
  );
}
