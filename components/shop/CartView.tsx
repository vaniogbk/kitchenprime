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
  const tCheckout = useTranslations('checkout');
  const { lines, setQty, remove, ready } = useCart();
  const numLocale = BCP47[locale];

  // Le panier vit dans le localStorage : tant qu'il n'est pas lu, afficher
  // « panier vide » serait un faux négatif visible une fraction de seconde.
  if (!ready) {
    return (
      <div className="cart-layout" aria-busy="true">
        <div className="cart-lines">
          <div className="kp-skeleton" style={{ height: 118 }} />
          <div className="kp-skeleton" style={{ height: 118 }} />
        </div>
        <div className="kp-skeleton" style={{ height: 300 }} />
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
  const itemCount = rows.reduce((sum, r) => sum + r.qty, 0);

  return (
    <div className="cart-layout">
      <ul className="cart-lines">
        {rows.map((r) => (
          <li className="cart-line" key={r.slug}>
            <div className="cart-line-img">
              <RemoteImage imageId={r.imageId} alt="" sizes="88px" quality={60} />
            </div>

            <div className="cart-line-body">
              <Link href={`/${locale}/produit/${r.slug}`} className="cart-line-name">
                {r.name}
              </Link>
              <div className="cart-line-ref">
                <span>{r.ref}</span>
                <span className="cart-line-unit">{formatEUR(r.priceCents, numLocale)}</span>
              </div>
            </div>

            {/* Les trois commandes forment un bloc unique : on lit « − 1 + »
                comme un seul contrôle, et non trois éléments voisins. */}
            <div className="cart-stepper">
              <button
                type="button"
                onClick={() => setQty(r.slug, r.qty - 1)}
                disabled={r.qty <= 1}
                aria-label={t('decrease', { name: r.name })}
              >
                <Icon name="minus" />
              </button>
              <input
                className="cart-qty"
                type="number"
                min={1}
                max={99}
                value={r.qty}
                aria-label={t('qty', { name: r.name })}
                onChange={(e) => setQty(r.slug, Math.max(1, Number(e.target.value) || 1))}
              />
              <button
                type="button"
                onClick={() => setQty(r.slug, r.qty + 1)}
                disabled={r.qty >= 99}
                aria-label={t('increase', { name: r.name })}
              >
                <Icon name="plus" />
              </button>
            </div>

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

      <aside className="sumcard">
        <h2 className="sum-title">
          <Icon name="receipt" /> {tCheckout('summary')}
        </h2>

        <div className="sum-row">
          <span>{t('itemCount', { count: itemCount })}</span>
          <span>{formatEUR(total, numLocale)}</span>
        </div>
        <div className="sum-row">
          <span>{tCheckout('shipping')}</span>
          <span className="sum-free">
            <Icon name="truck-fast" /> {tCheckout('free')}
          </span>
        </div>
        <div className="sum-row">
          <span>{tCheckout('vat')}</span>
          <span>{tCheckout('included')}</span>
        </div>

        <div className="sum-total">
          <span>{t('total')}</span>
          <span className="cart-total">{formatEUR(total, numLocale)}</span>
        </div>
        <p className="sum-note">{t('totalNote')}</p>

        <div className="sum-cta">
          <Link href={`/${locale}/checkout`} className="btn-checkout">
            <Icon name="lock" /> {t('checkout')}
          </Link>
          <Link href={`/${locale}/catalogue`} className="btn-secondary">
            <Icon name="arrow-left" /> {t('continue')}
          </Link>
        </div>

        <div className="sum-trust">
          <p className="sum-tr"><Icon name="shield-halved" /> {tCheckout('trustPay')}</p>
          <p className="sum-tr"><Icon name="truck-fast" /> {tCheckout('trustShip')}</p>
          <p className="sum-tr"><Icon name="rotate-left" /> {tCheckout('trustReturn')}</p>
          <p className="sum-tr"><Icon name="medal" /> {tCheckout('trustWarranty')}</p>
        </div>
      </aside>
    </div>
  );
}
