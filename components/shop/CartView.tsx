'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatEUR } from '@/lib/products';
import { BCP47 } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { useCart } from '@/components/shop/CartProvider';

/** Vue allégée d'un produit, préparée côté serveur et déjà traduite. */
export type CartCatalogEntry = {
  slug: string;
  name: string;
  ref: string;
  priceCents: number;
  imageId: string;
};

export function CartView({
  catalog,
  locale,
}: {
  catalog: CartCatalogEntry[];
  locale: Locale;
}) {
  const t = useTranslations('cart');
  const { lines, setQty, remove, ready } = useCart();
  const numLocale = BCP47[locale];

  // Le panier vit dans le localStorage : tant qu'il n'est pas lu, afficher
  // « panier vide » serait un faux négatif visible une fraction de seconde.
  if (!ready) {
    return (
      <div className="cart-lines" aria-busy="true">
        <div className="kp-skeleton" style={{ height: 98 }} />
        <div className="kp-skeleton" style={{ height: 98 }} />
      </div>
    );
  }

  const rows = lines
    .map((l) => {
      const p = catalog.find((c) => c.slug === l.slug);
      return p ? { ...p, qty: l.qty } : null;
    })
    // Un produit retiré du catalogue depuis la mise au panier est ignoré.
    .filter((r): r is CartCatalogEntry & { qty: number } => r !== null);

  if (rows.length === 0) {
    return (
      <div className="cart-empty">
        <Icon name="bag-shopping" />
        <p>{t('empty')}</p>
        <Link href={`/${locale}/catalogue`} className="btn-buy">
          <Icon name="table-cells-large" /> {t('emptyCta')}
        </Link>
      </div>
    );
  }

  const total = rows.reduce((sum, r) => sum + r.priceCents * r.qty, 0);

  return (
    <>
      <ul className="cart-lines">
        {rows.map((r) => (
          <li className="cart-line" key={r.slug}>
            <div className="cart-line-img">
              <RemoteImage imageId={r.imageId} alt="" sizes="72px" quality={60} />
            </div>
            <div>
              <Link href={`/${locale}/produit/${r.slug}`} className="cart-line-name">
                {r.name}
              </Link>
              <div className="cart-line-ref">
                {r.ref} · {formatEUR(r.priceCents, numLocale)}
              </div>
            </div>
            <input
              className="qval"
              type="number"
              min={1}
              max={99}
              value={r.qty}
              aria-label={t('qty', { name: r.name })}
              onChange={(e) => setQty(r.slug, Math.max(1, Number(e.target.value) || 1))}
            />
            <div className="cart-line-price">{formatEUR(r.priceCents * r.qty, numLocale)}</div>
            <button
              type="button"
              className="cart-remove"
              onClick={() => remove(r.slug)}
              aria-label={t('remove', { name: r.name })}
            >
              <Icon name="trash" />
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-foot">
        <div>
          <div className="cart-total-label">{t('total')}</div>
          <div className="cart-total">{formatEUR(total, numLocale)}</div>
          <div className="cart-line-ref">{t('totalNote')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href={`/${locale}/catalogue`} className="cat-chip alt">
            <Icon name="arrow-left" /> {t('continue')}
          </Link>
          <Link href={`/${locale}/checkout`} className="btn-buy">
            <Icon name="lock" /> {t('checkout')}
          </Link>
        </div>
      </div>
    </>
  );
}
