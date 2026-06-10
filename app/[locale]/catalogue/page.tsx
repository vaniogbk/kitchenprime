import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { CatalogGrid } from '@/components/shop/CatalogGrid';
import { PRODUCTS } from '@/lib/products';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('catalogTitle') };
}

export default function CatalogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { q?: string; cat?: string };
}) {
  unstable_setRequestLocale(locale);
  const validCats = ['robots', 'acc', 'livres', 'packs'] as const;
  const initialFilter = validCats.includes(searchParams.cat as typeof validCats[number])
    ? (searchParams.cat as typeof validCats[number])
    : 'all';

  return (
    <>
      <CatalogHeader />
      <CatalogGrid
        products={PRODUCTS}
        locale={locale}
        initialFilter={initialFilter}
        query={searchParams.q}
      />
    </>
  );
}

function CatalogHeader() {
  const t = useTranslations('catalog');
  return (
    <div style={{ background: 'var(--indigo-dark)', padding: 32 }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '.12em',
        textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 9,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <i className="fa-solid fa-grid-2" /> {t('eyebrow')}
      </div>
      <div style={{
        fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
        fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-.5px',
      }}>
        {t('title')}
      </div>
      <div style={{ fontSize: 13, color: '#9098C8', marginTop: 5 }}>{t('subtitle')}</div>
    </div>
  );
}
