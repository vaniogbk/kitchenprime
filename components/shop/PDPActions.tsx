'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { waOrderUrl } from '@/lib/whatsapp';
import { formatEUR } from '@/lib/products';
import { BCP47 } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/shop/CartProvider';

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
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const total = priceCents * qty;

  function addAndGoToCart() {
    add(productSlug, qty);
    router.push(`/${locale}/panier`);
  }

  return (
    <>
      <div className="qty">
        <label className="qty-label" htmlFor="pdp-qty">{t('qty')}</label>
        <div className="qty-ctrl">
          <button
            type="button"
            className="qbtn"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label={t('qtyMinus')}
          >
            <Icon name="minus" style={{ fontSize: 10 }} />
          </button>
          {/* Champ nombre plutôt qu'un simple affichage : saisissable au clavier
              et annoncé correctement par les lecteurs d'écran. */}
          <input
            id="pdp-qty"
            className="qval"
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
          />
          <button
            type="button"
            className="qbtn"
            onClick={() => setQty(Math.min(99, qty + 1))}
            aria-label={t('qtyPlus')}
          >
            <Icon name="plus" style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>
      <div className="pdp-cta">
        <button type="button" className="btn-buy" onClick={addAndGoToCart}>
          <Icon name="bag-shopping" /> {t('addToCart')} · {formatEUR(total, BCP47[locale])}
        </button>
        <a
          href={waOrderUrl(productName, tWa.raw('msg') as string)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa"
        >
          <Icon name="whatsapp" style={{ fontSize: 16 }} /> {t('orderWa')}
        </a>
      </div>
    </>
  );
}
