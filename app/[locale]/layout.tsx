// Importée ici, et pas seulement dans app/layout.tsx : ce layout racine rend
// `children` sans <html>/<body>, si bien que Next n'attachait sa feuille de
// styles qu'aux routes /admin (qui l'importent explicitement). Les pages
// publiques partaient donc sans aucun style en production.
import '../globals.css';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/lib/i18n';
import { pageMetadata, organizationLd, webSiteLd, jsonLdGraph } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/shop/CartProvider';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    ...pageMetadata({
      locale: locale as Locale,
      path: '/',
      title: t('homeTitle'),
      description: t('homeDesc'),
    }),
    // Le gabarit ne s'applique qu'aux pages enfants : `default` reste le
    // titre de l'accueil, déjà porteur de la marque.
    title: { default: t('homeTitle'), template: '%s | KitchenPrime' },
    applicationName: 'KitchenPrime',
    authors: [{ name: 'KitchenPrime' }],
    creator: 'KitchenPrime',
    publisher: 'KitchenPrime',
    formatDetection: { telephone: false, address: false, email: false },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      shortcut: ['/favicon.svg'],
      apple: [{ url: '/icon.svg' }],
    },
    manifest: '/manifest.webmanifest',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport = {
  themeColor: '#3D4DB8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as Locale)) notFound();
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'a11y' });

  return (
    <html lang={locale} className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        {/* Les visuels produit viennent d'Unsplash : ouvrir la connexion tôt
            évite un aller-retour DNS + TLS sur le chemin critique du LCP. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a href="#content" className="skip-link">{t('skipToContent')}</a>
          <CartProvider>
            <div className="kp" id="kp-root">
              <TopBar currentLocale={locale as Locale} />
              <Header locale={locale as Locale} />
              <main id="content">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </NextIntlClientProvider>
        <JsonLd json={jsonLdGraph(organizationLd(), webSiteLd(locale as Locale))} />
      </body>
    </html>
  );
}
