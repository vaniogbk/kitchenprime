import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LegalArticle } from '@/components/legal/LegalArticle';
import { getLegal } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/politique-retour',
    title: t('returnsTitle'),
    description: t('returnsDesc'),
  });
}

export default function PolitiqueRetourPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return <LegalArticle page={getLegal(locale).returns} icon="rotate-left" locale={locale} />;
}
