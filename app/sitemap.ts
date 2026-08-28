import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { locales, defaultLocale } from '@/lib/i18n';
import { absoluteUrl, BCP47 } from '@/lib/seo';

/** Chemins publics, sans préfixe de locale, avec leur poids relatif. */
const STATIC_PATHS: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '', priority: 1, freq: 'weekly' },
  { path: '/catalogue', priority: 0.9, freq: 'weekly' },
  { path: '/contact', priority: 0.5, freq: 'yearly' },
  { path: '/cgv', priority: 0.3, freq: 'yearly' },
  { path: '/mentions-legales', priority: 0.3, freq: 'yearly' },
  { path: '/politique-retour', priority: 0.4, freq: 'yearly' },
];

/**
 * Bloc `alternates` d'une entrée : déclare les 4 versions linguistiques.
 * Sans lui, les 4 locales d'une même page se concurrencent au lieu d'être
 * reconnues comme des traductions.
 */
function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[BCP47[l]] = absoluteUrl(`/${l}${path}`);
  languages['x-default'] = absoluteUrl(`/${defaultLocale}${path}`);
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, priority, freq } of STATIC_PATHS) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: alternates(path),
      });
    }
    for (const p of PRODUCTS) {
      const path = `/produit/${p.slug}`;
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: alternates(path),
      });
    }
  }

  // Le panier, les favoris et le tunnel de commande sont volontairement
  // absents : ils sont en noindex et n'ont aucune valeur d'entrée.
  return entries;
}
