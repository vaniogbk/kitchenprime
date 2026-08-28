import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LegalArticle } from '@/components/legal/LegalArticle';
import { getLegal } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/mentions-legales',
    title: t('legalTitle'),
    description: t('legalDesc'),
  });
}

export default function MentionsLegalesPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  return <LegalArticle page={getLegal(locale).legal} icon="scale-balanced" locale={locale} />;
}
