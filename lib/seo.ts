import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from './i18n';

/** Identité du site, réutilisée par les métadonnées et les données structurées. */
export const SITE = {
  name: 'KitchenPrime',
  legalName: 'KitchenPrime SAS',
  /** Chemin de l'image OG par défaut (générée par app/[locale]/opengraph-image.tsx). */
  twitter: '@kitchenprime',
  email: 'kitchenprime@outlook.com',
  phone: '+33756976502',
  address: {
    street: '539 route de Saint-Joseph, CS 20811',
    postalCode: '44308',
    city: 'Nantes Cedex 3',
    country: 'FR',
  },
  socials: [
    'https://facebook.com',
    'https://instagram.com',
    'https://tiktok.com',
  ],
  /** Pays desservis — utilisé par shippingDetails du JSON-LD Offer. */
  shipsTo: ['FR', 'DE', 'IT', 'BE', 'LU', 'ES', 'NL', 'AT'],
} as const;

/**
 * URL publique du site.
 *
 * Priorité : NEXT_PUBLIC_APP_URL (défini explicitement) → URL de déploiement
 * Vercel → domaine de production. Les URL absolues sont indispensables aux
 * canoniques, aux hreflang et au JSON-LD : une URL relative y est ignorée par
 * les moteurs.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit && /^https?:\/\//.test(explicit)) return explicit.replace(/\/$/, '');
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;
  return 'https://kitchenprime.com';
}

/** Transforme un chemin applicatif en URL absolue. */
export function absoluteUrl(path = '/'): string {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Code de langue-région pour les balises Open Graph. */
export const OG_LOCALE: Record<Locale, string> = {
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  en: 'en_GB',
};

/** Code BCP-47 utilisé pour le formatage des nombres et les hreflang. */
export const BCP47: Record<Locale, string> = {
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  en: 'en-GB',
};

/**
 * Canonique + hreflang d'une page.
 *
 * `path` est le chemin SANS préfixe de locale (`/catalogue`, `/produit/x`, `''`
 * pour l'accueil). On émet une alternative par locale plus `x-default`, qui
 * pointe vers la locale par défaut : c'est ce que Google attend pour les
 * visiteurs dont aucune langue ne correspond.
 */
export function alternatesFor(path: string, locale: Locale): Metadata['alternates'] {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[BCP47[l]] = absoluteUrl(`/${l}${clean}`);
  languages['x-default'] = absoluteUrl(`/${defaultLocale}${clean}`);
  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages,
  };
}

type PageMetaInput = {
  locale: Locale;
  /** Chemin sans préfixe de locale. */
  path: string;
  title: string;
  description: string;
  /** Chemin absolu ou relatif de l'image OG. Défaut : l'image générée de la page. */
  image?: string;
  /** Empêche l'indexation (tunnel de commande, espace admin…). */
  noIndex?: boolean;
  type?: 'website' | 'article';
};

/**
 * Fabrique le bloc `Metadata` complet d'une page : canonique, hreflang,
 * Open Graph et Twitter Card. Centralisé pour qu'aucune page ne parte avec
 * une balise manquante.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex = false,
  type = 'website',
}: PageMetaInput): Metadata {
  const url = absoluteUrl(`/${locale}${path === '/' ? '' : path}`);
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl()),
    alternates: alternatesFor(path, locale),
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
        },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

/* ────────────────────────── Données structurées ───────────────────────────
 * Schema.org en JSON-LD. C'est ce qui alimente les résultats enrichis Google :
 * prix et disponibilité sous les fiches produit, fil d'Ariane, panneau
 * de connaissance de la marque.
 * ------------------------------------------------------------------------ */

export type JsonLdObject = Record<string, unknown>;

export function organizationLd(): JsonLdObject {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl()}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: siteUrl(),
    logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.svg') },
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    sameAs: [...SITE.socials],
  };
}

export function webSiteLd(locale: Locale): JsonLdObject {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl()}/#website`,
    name: SITE.name,
    url: absoluteUrl(`/${locale}`),
    inLanguage: BCP47[locale],
    publisher: { '@id': `${siteUrl()}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl(`/${locale}/catalogue?q={search_term_string}`),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>): JsonLdObject {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

type ProductLdInput = {
  name: string;
  description: string;
  sku: string;
  slug: string;
  brand: string;
  image: string[];
  priceCents: number;
  rating: number;
  reviewsCount: number;
  locale: Locale;
  category: string;
  /** L'électroménager est vendu neuf ; les Thermomix sont reconditionnés. */
  condition: 'new' | 'refurbished';
};

export function productLd(p: ProductLdInput): JsonLdObject {
  const url = absoluteUrl(`/${p.locale}/produit/${p.slug}`);
  // Une offre reste valable au plus un an : au-delà, Google considère
  // l'information périmée et retire l'extrait enrichi.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    description: p.description,
    sku: p.sku,
    mpn: p.sku,
    category: p.category,
    image: p.image,
    brand: { '@type': 'Brand', name: p.brand },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EUR',
      price: (p.priceCents / 100).toFixed(2),
      priceValidUntil,
      availability: 'https://schema.org/InStock',
      itemCondition:
        p.condition === 'new'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/RefurbishedCondition',
      seller: { '@id': `${siteUrl()}/#organization` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'EUR' },
        shippingDestination: SITE.shipsTo.map((c) => ({
          '@type': 'DefinedRegion',
          addressCountry: c,
        })),
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: [...SITE.shipsTo],
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: p.rating.toFixed(1),
      reviewCount: p.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function itemListLd(
  items: Array<{ name: string; url: string }>,
  listName: string,
): JsonLdObject {
  return {
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}

/**
 * Emballe un ou plusieurs nœuds dans un unique `@graph`.
 *
 * Un seul bloc JSON-LD par page est plus fiable que plusieurs balises
 * séparées : les `@id` permettent aux nœuds de se référencer entre eux
 * (une Offer pointe vers l'Organization vendeuse, par exemple).
 */
export function jsonLdGraph(...nodes: JsonLdObject[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
