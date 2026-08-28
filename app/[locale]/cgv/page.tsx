import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LegalArticle } from '@/components/legal/LegalArticle';
import { getLegal } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/cgv',
    title: t('cgvTitle'),
    description: t('cgvDesc'),
  });
}

export default function CGVPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return <LegalArticle page={getLegal(locale).cgv} icon="file-contract" locale={locale} />;
}
