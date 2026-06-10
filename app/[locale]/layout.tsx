import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kitchenprime.com';
  return {
    title: { default: t('homeTitle'), template: '%s | KitchenPrime' },
    description: t('homeDesc'),
    keywords: ['Thermomix TM7', 'KitchenPrime', 'robot culinaire', 'Küchenmaschine', 'robot da cucina'],
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : locale === 'de' ? 'de_DE' : locale === 'it' ? 'it_IT' : 'en_GB',
      siteName: 'KitchenPrime',
      title: t('homeTitle'),
      description: t('homeDesc'),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', de: '/de', it: '/it', en: '/en' },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as Locale)) notFound();
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="kp" id="kp-root">
            <TopBar currentLocale={locale as Locale} />
            <Header locale={locale as Locale} />
            {children}
            <Footer />
          </div>
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
