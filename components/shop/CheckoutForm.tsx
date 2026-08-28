'use client';
import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { formatEUR } from '@/lib/products';
import { BCP47 } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { useCart } from '@/components/shop/CartProvider';
import {
  ENABLED_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
  formatIban,
  type PaymentMethod,
} from '@/lib/payment';
import { type CartCatalogEntry } from '@/components/shop/CartView';

const CK_KEY = 'kp_customer';

type CustomerData = {
  name: string; email: string; phone: string;
  address: string; city: string; zip: string; country: string;
  method: PaymentMethod;
};

type BankInfo = {
  id: string; label: string; holder: string;
  iban: string; bic: string | null; bank: string | null;
};

const COUNTRIES = ['FR', 'DE', 'IT', 'BE', 'CH'] as const;

export function CheckoutForm({
  catalog,
  directLine,
  locale,
}: {
  catalog: CartCatalogEntry[];
  /** Achat direct depuis une fiche produit ; `null` = on facture le panier. */
  directLine: { slug: string; qty: number } | null;
  locale: Locale;
}) {
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const { lines: cartLines, clear, ready } = useCart();
  const [method, setMethod] = useState<PaymentMethod>(DEFAULT_PAYMENT_METHOD);
  // Un seul moyen actif : pas de choix à présenter, on l'annonce simplement.
  const singleMethod = ENABLED_PAYMENT_METHODS.length === 1;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<CustomerData | null>(null);
  const [editing, setEditing] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const numLocale = BCP47[locale];

  const lines = useMemo(() => (directLine ? [directLine] : cartLines), [directLine, cartLines]);

  const rows = useMemo(
    () =>
      lines
        .map((l) => {
          const p = catalog.find((c) => c.slug === l.slug);
          return p ? { ...p, qty: l.qty } : null;
        })
        .filter((r): r is CartCatalogEntry & { qty: number } => r !== null),
    [lines, catalog],
  );

  const subtotal = rows.reduce((sum, r) => sum + r.priceCents * r.qty, 0);
  const total = subtotal;

  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem(CK_KEY);
      if (rawSaved) {
        const data = JSON.parse(rawSaved) as CustomerData;
        setSaved(data);
        // Un moyen enregistré mais désormais désactivé ne doit pas resurgir.
        setMethod(
          data.method && ENABLED_PAYMENT_METHODS.includes(data.method)
            ? data.method
            : DEFAULT_PAYMENT_METHOD,
        );
      }
    } catch {
      /* stockage indisponible : on repart d'un formulaire vierge */
    }
    fetch('/api/bank-account')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setBankInfo(d); })
      .catch(() => { /* l'IBAN sera envoyé par e-mail, voir ibanFallback */ });
  }, []);

  async function doSubmit(customer: CustomerData) {
    if (rows.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: customer.method,
          items: rows.map((r) => ({ productSlug: r.slug, quantity: r.qty })),
          locale,
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('genericError'));
      localStorage.setItem(CK_KEY, JSON.stringify(customer));
      // Le panier n'est vidé qu'une fois la commande acceptée par le serveur.
      if (!directLine) clear();
      window.location.href = data.checkoutUrl ?? `/${locale}?orderId=${data.orderId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : t('genericError'));
      setSubmitting(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await doSubmit({
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      address: String(form.get('address') || ''),
      city: String(form.get('city') || ''),
      zip: String(form.get('zip') || ''),
      country: String(form.get('country') || 'FR'),
      method,
    });
  }

  const showSaved = saved && !editing;
  const empty = ready && rows.length === 0;

  if (empty) {
    return (
      <div className="cart-empty">
        <Icon name="bag-shopping" />
        <p>{tCart('empty')}</p>
        <a href={`/${locale}/catalogue`} className="btn-buy">
          <Icon name="table-cells-large" /> {tCart('emptyCta')}
        </a>
      </div>
    );
  }

  return (
    <div className="ck-grid">
      <div>
        {showSaved ? (
          /* ── Client déjà connu : commande en un clic ── */
          <div className="ck-saved">
            <div className="ck-saved-top">
              <div className="ck-saved-check"><Icon name="circle-check" /></div>
              <div>
                <div className="ck-saved-name">{t('greeting', { name: saved.name.split(' ')[0] })}</div>
                <div className="ck-saved-addr">{saved.address}, {saved.zip} {saved.city}</div>
                <div className="ck-saved-email">{saved.email}</div>
              </div>
            </div>
            <div className="ck-saved-pm">
              <Icon name={saved.method === 'card' ? 'credit-card' : 'building-columns'} />
              {' '}{saved.method === 'card' ? t('savedPmCard') : t('savedPmWise')}
            </div>
            {error && <p className="ck-error" role="alert">{error}</p>}
            <div className="ck-saved-btns">
              <button
                type="button"
                className="btn-checkout"
                disabled={submitting}
                onClick={() => doSubmit(saved)}
              >
                <Icon name="lock" />
                {submitting ? ` ${t('processing')}` : ` ${t('order')} · ${formatEUR(total, numLocale)}`}
              </button>
              <button type="button" className="ck-change" onClick={() => setEditing(true)}>
                <Icon name="pen-to-square" /> {t('changeCard')}
              </button>
            </div>
          </div>
        ) : (
          /* ── Formulaire complet ── */
          <form onSubmit={onSubmit}>
            {saved && (
              <button type="button" className="ck-back" onClick={() => setEditing(false)}>
                <Icon name="arrow-left" /> {t('useSaved')}
              </button>
            )}

            <div className="fcard">
              <h2 className="fcard-title">
                <Icon name="location-dot" /> {t('shippingTitle')}
              </h2>
              <div className="fgrid">
                <div className="fg ffull">
                  <label htmlFor="ck-name">{t('fullName')} *</label>
                  <input id="ck-name" type="text" name="name" autoComplete="name" placeholder={t('fullNameP')} required defaultValue={saved?.name} />
                </div>
                <div className="fg">
                  <label htmlFor="ck-email">{t('email')} *</label>
                  <input id="ck-email" type="email" name="email" autoComplete="email" placeholder={t('emailP')} required defaultValue={saved?.email} />
                </div>
                <div className="fg">
                  <label htmlFor="ck-phone">{t('phone')}</label>
                  <input id="ck-phone" type="tel" name="phone" autoComplete="tel" placeholder={t('phoneP')} defaultValue={saved?.phone} />
                </div>
                <div className="fg ffull">
                  <label htmlFor="ck-address">{t('address')} *</label>
                  <input id="ck-address" type="text" name="address" autoComplete="street-address" placeholder={t('addressP')} required defaultValue={saved?.address} />
                </div>
                <div className="fg">
                  <label htmlFor="ck-city">{t('city')} *</label>
                  <input id="ck-city" type="text" name="city" autoComplete="address-level2" placeholder={t('cityP')} required defaultValue={saved?.city} />
                </div>
                <div className="fg">
                  <label htmlFor="ck-zip">{t('zip')} *</label>
                  <input id="ck-zip" type="text" name="zip" autoComplete="postal-code" inputMode="numeric" placeholder={t('zipP')} required defaultValue={saved?.zip} />
                </div>
                <div className="fg ffull">
                  <label htmlFor="ck-country">{t('country')} *</label>
                  <select id="ck-country" name="country" autoComplete="country" defaultValue={saved?.country || 'FR'} required>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{t(`country${c}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="fcard">
              <h2 className="fcard-title">
                <Icon name="building-columns" /> {t('paymentTitle')}
              </h2>

              {ENABLED_PAYMENT_METHODS.includes('card') && (
                <label className={`pm-opt${method === 'card' ? ' on' : ''}`}>
                  <input type="radio" name="pm" checked={method === 'card'} onChange={() => setMethod('card')} />
                  <div>
                    <div className="pm-name">
                      <Icon name="credit-card" /> {t('pmCard')}
                      <span className="pm-rec">{t('pmCardRec')}</span>
                    </div>
                    <div className="pm-sub">{t('pmCardSub')}</div>
                  </div>
                </label>
              )}

              {ENABLED_PAYMENT_METHODS.includes('wise') && (
                <label className={`pm-opt on${singleMethod ? ' pm-opt--only' : ''}`}>
                  {/* Moyen unique : la case reste dans le DOM pour les lecteurs
                      d'écran, mais elle est masquée — il n'y a rien à choisir. */}
                  <input
                    type="radio"
                    name="pm"
                    checked={method === 'wise'}
                    onChange={() => setMethod('wise')}
                    className={singleMethod ? 'sr-only' : undefined}
                  />
                  <div className="pm-wise-body">
                    <div className="pm-name">
                      <Icon name="building-columns" /> {t('pmWise')}
                    </div>
                    <div className="pm-sub">{t('pmWiseSub')}</div>
                    {method === 'wise' && bankInfo && (
                      <div className="ck-iban-box">
                        <div className="ck-iban-label">
                          <Icon name="circle-info" /> {t('ibanTitle')}
                        </div>
                        <table className="ck-iban-table">
                          <tbody>
                            <tr><td>{t('beneficiary')}</td><td><strong>{bankInfo.holder}</strong></td></tr>
                            {bankInfo.bank && <tr><td>{t('bank')}</td><td>{bankInfo.bank}</td></tr>}
                            <tr><td>IBAN</td><td><span className="ck-iban-mono">{formatIban(bankInfo.iban)}</span></td></tr>
                            {bankInfo.bic && <tr><td>BIC</td><td><span className="ck-iban-mono">{bankInfo.bic}</span></td></tr>}
                          </tbody>
                        </table>
                        <div className="ck-iban-note">{t('ibanNote')}</div>
                      </div>
                    )}
                    {method === 'wise' && !bankInfo && (
                      <div className="ck-iban-note ck-iban-note--fallback">{t('ibanFallback')}</div>
                    )}
                  </div>
                </label>
              )}
            </div>

            {error && <p className="ck-error" role="alert">{error}</p>}

            <div className="ck-submit-row">
              <button
                type="submit"
                disabled={submitting}
                className={`btn-checkout${submitting ? ' loading' : ''}`}
              >
                <Icon name="lock" />
                {submitting ? ` ${t('processing')}` : ` ${t('confirmPay')} · ${formatEUR(total, numLocale)}`}
              </button>
              <p className="ck-secure-note">
                <Icon name="shield-halved" /> {t('secureNote')}
              </p>
            </div>
          </form>
        )}
      </div>

      <aside className="sumcard">
        <h2 className="sum-title">
          <Icon name="receipt" /> {t('summary')}
        </h2>
        {rows.map((r) => (
          <div className="sum-item" key={r.slug}>
            <div className="sum-img">
              <RemoteImage imageId={r.imageId} alt="" sizes="50px" quality={55} />
            </div>
            <div>
              <div className="sum-iname">{r.name}</div>
              <div className="sum-isub">{t('lineSub', { ref: r.ref, qty: r.qty })}</div>
            </div>
            <div className="sum-iprice">{formatEUR(r.priceCents * r.qty, numLocale)}</div>
          </div>
        ))}
        <div>
          <div className="sum-row">
            <span>{t('subtotal')}</span>
            <span>{formatEUR(subtotal, numLocale)}</span>
          </div>
          <div className="sum-row">
            <span>{t('shipping')}</span>
            <span className="sum-free">
              <Icon name="truck-fast" /> {t('free')}
            </span>
          </div>
          <div className="sum-row">
            <span>{t('vat')}</span>
            <span>{t('included')}</span>
          </div>
          <div className="sum-total">
            <span>{t('total')}</span>
            <span>{formatEUR(total, numLocale)}</span>
          </div>
        </div>
        <div className="sum-trust">
          <div className="sum-tr"><Icon name="shield-halved" /> {t('trustPay')}</div>
          <div className="sum-tr"><Icon name="truck-fast" /> {t('trustShip')}</div>
          <div className="sum-tr"><Icon name="rotate-left" /> {t('trustReturn')}</div>
          <div className="sum-tr"><Icon name="medal" /> {t('trustWarranty')}</div>
        </div>
      </aside>
    </div>
  );
}
