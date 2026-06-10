'use client';
import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { type Product, formatEUR, unsplashUrl } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

const localeMap: Record<Locale, string> = {
  fr: 'fr-FR', de: 'de-DE', it: 'it-IT', en: 'en-GB',
};

type PaymentMethod = 'card' | 'wise';

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
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = product.priceCents * qty;
  const shipping = 0;
  const total = subtotal + shipping;
  const numLocale = localeMap[locale];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      paymentMethod: method,
      items: [{ productSlug: product.slug, quantity: qty }],
      locale,
      customer: {
        name: String(form.get('name') || ''),
        email: String(form.get('email') || ''),
        phone: String(form.get('phone') || ''),
        address: String(form.get('address') || ''),
        city: String(form.get('city') || ''),
        zip: String(form.get('zip') || ''),
        country: String(form.get('country') || 'FR'),
      },
    };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        window.location.href = `/${locale}?orderId=${data.orderId}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
      setSubmitting(false);
    }
  }

  return (
    <form className="ck-grid" onSubmit={onSubmit}>
      <div>
        <div className="fcard">
          <div className="fcard-title">
            <i className="fa-solid fa-location-dot" /> {t('shippingTitle')}
          </div>
          <div className="fgrid">
            <div className="fg ffull">
              <label>{t('fullName')} *</label>
              <input type="text" name="name" placeholder={t('fullNameP')} required />
            </div>
            <div className="fg">
              <label>{t('email')} *</label>
              <input type="email" name="email" placeholder={t('emailP')} required />
            </div>
            <div className="fg">
              <label>{t('phone')}</label>
              <input type="tel" name="phone" placeholder={t('phoneP')} />
            </div>
            <div className="fg ffull">
              <label>{t('address')} *</label>
              <input type="text" name="address" placeholder={t('addressP')} required />
            </div>
            <div className="fg">
              <label>{t('city')} *</label>
              <input type="text" name="city" placeholder={t('cityP')} required />
            </div>
            <div className="fg">
              <label>{t('zip')} *</label>
              <input type="text" name="zip" placeholder={t('zipP')} required />
            </div>
            <div className="fg ffull">
              <label>{t('country')} *</label>
              <select name="country" defaultValue="FR" required>
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
            <input
              type="radio"
              name="pm"
              checked={method === 'card'}
              onChange={() => setMethod('card')}
            />
            <div>
              <div className="pm-name">
                <i className="fa-solid fa-credit-card" /> {t('pmCard')}
                <span style={{ fontSize: 10, background: 'var(--copper-50)', color: 'var(--copper)', padding: '2px 7px', borderRadius: 5, marginLeft: 4 }}>
                  {t('pmCardRec')}
                </span>
              </div>
              <div className="pm-sub">{t('pmCardSub')}</div>
            </div>
          </label>
          <label className={`pm-opt${method === 'wise' ? ' on' : ''}`}>
            <input
              type="radio"
              name="pm"
              checked={method === 'wise'}
              onChange={() => setMethod('wise')}
            />
            <div>
              <div className="pm-name">
                <i className="fa-solid fa-building-columns" /> {t('pmWise')}
              </div>
              <div className="pm-sub">{t('pmWiseSub')}</div>
            </div>
          </label>
        </div>

        {error && (
          <div style={{ color: '#9E4E1E', fontSize: 13, marginBottom: 12 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-buy"
          style={{ width: '100%', padding: 16, fontSize: 14, opacity: submitting ? 0.6 : 1 }}
        >
          <i className="fa-solid fa-lock" />{' '}
          {submitting ? '…' : `${t('confirmPay')} — ${formatEUR(total, numLocale)}`}
        </button>
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
            <span style={{ color: '#0E7268', fontWeight: 700 }}>
              <i className="fa-solid fa-truck-fast" style={{ fontSize: 10 }} /> {t('free')}
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
    </form>
  );
}
