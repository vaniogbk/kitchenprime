import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckoutForm } from '@/components/shop/CheckoutForm';
import { getProductBySlug, PRODUCTS } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('checkoutTitle') };
}

export default function CheckoutPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { p?: string; qty?: string };
}) {
  unstable_setRequestLocale(locale);
  const slug = searchParams.p || 'thermomix-tm7';
  const product = getProductBySlug(slug) || PRODUCTS[0];
  const qty = Math.max(1, Number(searchParams.qty || 1));

  return (
    <div className="checkout">
      <CheckoutHeader />
      <CheckoutForm product={product} qty={qty} locale={locale} />
    </div>
  );
}

function CheckoutHeader() {
  const t = useTranslations('checkout');
  return (
    <>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '.12em',
        textTransform: 'uppercase', color: 'var(--copper)', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <i className="fa-solid fa-lock" /> {t('secure')}
      </div>
      <div style={{
        fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
        fontSize: 26, fontWeight: 900, color: 'var(--ink)',
      }}>
        {t('title')}
      </div>
    </>
  );
}
