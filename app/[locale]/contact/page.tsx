import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LegalArticle } from '@/components/legal/LegalArticle';
import { getLegal } from '@/content/legal';
import { pageMetadata, SITE, absoluteUrl, jsonLdGraph, type JsonLdObject } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { WA_NUMBER } from '@/lib/whatsapp';
import { type Locale, locales } from '@/lib/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/contact',
    title: t('contactTitle'),
    description: t('contactDesc'),
  });
}

/** Fiche de contact structurée : alimente le panneau de connaissance Google. */
function contactPageLd(locale: Locale, title: string): JsonLdObject {
  return {
    '@type': 'ContactPage',
    '@id': `${absoluteUrl(`/${locale}/contact`)}#contactpage`,
    name: title,
    url: absoluteUrl(`/${locale}/contact`),
    mainEntity: {
      '@id': `${absoluteUrl('/')}#organization`.replace('//#', '/#'),
      '@type': 'Organization',
      name: SITE.name,
      email: SITE.email,
      telephone: SITE.phone,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.email,
        telephone: SITE.phone,
        availableLanguage: locales.map((l) => l.toUpperCase()),
      },
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(locale);
  const page = getLegal(locale).contact;

  return (
    <>
      <LegalArticle page={page} icon="headset" locale={locale}>
        <div className="contact-cards">
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card contact-card--wa"
          >
            <div className="contact-card-icon"><Icon name="whatsapp" /></div>
            <div className="contact-card-title">{page.cards.whatsapp.title}</div>
            <div className="contact-card-val">{SITE.phone}</div>
            <div className="contact-card-note">{page.cards.whatsapp.note}</div>
          </a>
          <a href={`mailto:${SITE.email}`} className="contact-card contact-card--mail">
            <div className="contact-card-icon"><Icon name="envelope" /></div>
            <div className="contact-card-title">{page.cards.email.title}</div>
            <div className="contact-card-val">{SITE.email}</div>
            <div className="contact-card-note">{page.cards.email.note}</div>
          </a>
          <div className="contact-card contact-card--addr">
            <div className="contact-card-icon"><Icon name="location-dot" /></div>
            <div className="contact-card-title">{page.cards.address.title}</div>
            <div className="contact-card-val">{page.cards.address.value}</div>
            <div className="contact-card-note">{page.cards.address.note}</div>
          </div>
        </div>

        <section className="legal-section">
          <h2>{page.hours.title}</h2>
          <div className="contact-hours">
            {page.hours.rows.map(([day, hours]) => (
              <div className="ch-row" key={day}>
                <span>{day}</span>
                <span>{hours}</span>
              </div>
            ))}
            <div className="ch-row ch-closed">
              <span>{page.hours.closedLabel}</span>
              <span>{page.hours.closedValue}</span>
            </div>
          </div>
        </section>
      </LegalArticle>
      <JsonLd json={jsonLdGraph(contactPageLd(locale, page.title))} />
    </>
  );
}
