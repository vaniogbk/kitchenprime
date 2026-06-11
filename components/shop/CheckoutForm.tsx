'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { type Product, formatEUR, unsplashUrl } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

const CK_KEY = 'kp_customer';

type CustomerData = {
  name: string; email: string; phone: string;
  address: string; city: string; zip: string; country: string;
  method: 'card' | 'wise';
};

const localeMap: Record<Locale, string> = {
  fr: 'fr-FR', de: 'de-DE', it: 'it-IT', en: 'en-GB',
};

export function CheckoutForm({
  product,
  qty,
  locale,
}: {
  product: Product;
  qty: number;
  locale: Locale;
}) {
  const t = useTranslations('checkout');
  const [method, setMethod] = useState<'card' | 'wise'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<CustomerData | null>(null);
  const [editing, setEditing] = useState(false);

  const subtotal = product.priceCents * qty;
  const total = subtotal;
  const numLocale = localeMap[locale];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CK_KEY);
      if (raw) {
        const data = JSON.parse(raw) as CustomerData;
        setSaved(data);
        setMethod(data.method || 'card');
      }
    } catch {}
  }, []);

  async function doSubmit(customer: CustomerData) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: customer.method,
          items: [{ productSlug: product.slug, quantity: qty }],
          locale,
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      localStorage.setItem(CK_KEY, JSON.stringify(customer));
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else window.location.href = `/${locale}?orderId=${data.orderId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
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

  return (
    <div className="ck-grid">
      <div>
        {showSaved ? (
          /* ── Returning customer fast-track ── */
          <div className="ck-saved">
            <div className="ck-saved-top">
              <div className="ck-saved-check"><i className="fa-solid fa-circle-check" /></div>
              <div>
                <div className="ck-saved-name">Bonjour, {saved.name.split(' ')[0]} !</div>
                <div className="ck-saved-addr">{saved.address}, {saved.zip} {saved.city}</div>
                <div className="ck-saved-email">{saved.email}</div>
              </div>
            </div>
            <div className="ck-saved-pm">
              <i className={saved.method === 'card' ? 'fa-solid fa-credit-card' : 'fa-solid fa-building-columns'} />
              {saved.method === 'card' ? ' Paiement par carte sécurisée' : ' Virement Wise'}
            </div>
            {error && <div className="ck-error">{error}</div>}
            <div className="ck-saved-btns">
              <button
                type="button"
                className="btn-checkout"
                disabled={submitting}
                onClick={() => doSubmit(saved)}
              >
                <i className="fa-solid fa-lock" />
                {submitting ? ' Traitement…' : ` Commander · ${formatEUR(total, numLocale)}`}
              </button>
              <button type="button" className="ck-change" onClick={() => setEditing(true)}>
                <i className="fa-solid fa-pen-to-square" /> Changer la carte
              </button>
            </div>
          </div>
        ) : (
          /* ── Full form ── */
          <form onSubmit={onSubmit}>
            {saved && (
              <button type="button" className="ck-back" onClick={() => setEditing(false)}>
                <i className="fa-solid fa-arrow-left" /> Utiliser mes infos sauvegardées
              </button>
            )}

            <div className="fcard">
              <div className="fcard-title">
                <i className="fa-solid fa-location-dot" /> {t('shippingTitle')}
              </div>
              <div className="fgrid">
                <div className="fg ffull">
                  <label>{t('fullName')} *</label>
                  <input type="text" name="name" placeholder={t('fullNameP')} required defaultValue={saved?.name} />
                </div>
                <div className="fg">
                  <label>{t('email')} *</label>
                  <input type="email" name="email" placeholder={t('emailP')} required defaultValue={saved?.email} />
                </div>
                <div className="fg">
                  <label>{t('phone')}</label>
                  <input type="tel" name="phone" placeholder={t('phoneP')} defaultValue={saved?.phone} />
                </div>
                <div className="fg ffull">
                  <label>{t('address')} *</label>
                  <input type="text" name="address" placeholder={t('addressP')} required defaultValue={saved?.address} />
                </div>
                <div className="fg">
                  <label>{t('city')} *</label>
                  <input type="text" name="city" placeholder={t('cityP')} required defaultValue={saved?.city} />
                </div>
                <div className="fg">
                  <label>{t('zip')} *</label>
                  <input type="text" name="zip" placeholder={t('zipP')} required defaultValue={saved?.zip} />
                </div>
                <div className="fg ffull">
                  <label htmlFor="country">{t('country')} *</label>
                  <select id="country" name="country" title={t('country')} defaultValue={saved?.country || 'FR'} required>
                    <option value="FR">🇫🇷 France</option>
                    <option value="DE">🇩🇪 Allemagne</option>
                    <option value="IT">🇮🇹 Italie</option>
                    <option value="BE">🇧🇪 Belgique</option>
                    <option value="CH">🇨🇭 Suisse</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="fcard">
              <div className="fcard-title">
                <i className="fa-solid fa-credit-card" /> {t('paymentTitle')}
              </div>
              <label className={`pm-opt${method === 'card' ? ' on' : ''}`}>
                <input type="radio" name="pm" checked={method === 'card'} onChange={() => setMethod('card')} />
                <div>
                  <div className="pm-name">
                    <i className="fa-solid fa-credit-card" /> {t('pmCard')}
                    <span className="pm-rec">{t('pmCardRec')}</span>
                  </div>
                  <div className="pm-sub">{t('pmCardSub')}</div>
                </div>
              </label>
              <label className={`pm-opt${method === 'wise' ? ' on' : ''}`}>
                <input type="radio" name="pm" checked={method === 'wise'} onChange={() => setMethod('wise')} />
                <div>
                  <div className="pm-name">
                    <i className="fa-solid fa-building-columns" /> {t('pmWise')}
                  </div>
                  <div className="pm-sub">{t('pmWiseSub')}</div>
                </div>
              </label>
            </div>

            {error && <div className="ck-error">{error}</div>}

            <div className="ck-submit-row">
              <button
                type="submit"
                disabled={submitting}
                className={`btn-checkout${submitting ? ' loading' : ''}`}
              >
                <i className="fa-solid fa-lock" />
                {submitting ? ' Traitement…' : ` ${t('confirmPay')} · ${formatEUR(total, numLocale)}`}
              </button>
              <p className="ck-secure-note">
                <i className="fa-solid fa-shield-halved" /> Paiement 100% sécurisé — données chiffrées SSL
              </p>
            </div>
          </form>
        )}
      </div>

      <aside className="sumcard">
        <div className="sum-title">
          <i className="fa-solid fa-receipt" /> {t('summary')}
        </div>
        <div className="sum-item">
          <div className="sum-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={unsplashUrl(product.imageId, 120, 70)} alt="" />
          </div>
          <div>
            <div className="sum-iname">{product.name}</div>
            <div className="sum-isub">Réf. {product.ref} · Qté {qty}</div>
          </div>
          <div className="sum-iprice">{formatEUR(subtotal, numLocale)}</div>
        </div>
        <div>
          <div className="sum-row">
            <span>{t('subtotal')}</span>
            <span>{formatEUR(subtotal, numLocale)}</span>
          </div>
          <div className="sum-row">
            <span>{t('shipping')}</span>
            <span className="sum-free">
              <i className="fa-solid fa-truck-fast" /> {t('free')}
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
          <div className="sum-tr"><i className="fa-solid fa-shield-halved" /> {t('trustPay')}</div>
          <div className="sum-tr"><i className="fa-solid fa-truck-fast" /> {t('trustShip')}</div>
          <div className="sum-tr"><i className="fa-solid fa-rotate-left" /> {t('trustReturn')}</div>
          <div className="sum-tr"><i className="fa-solid fa-medal" /> {t('trustWarranty')}</div>
        </div>
      </aside>
    </div>
  );
}
