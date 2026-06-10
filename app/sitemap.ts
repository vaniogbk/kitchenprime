import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { locales } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://kitchenprime.com';
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const loc of locales) {
    entries.push({ url: `${base}/${loc}`, lastModified: now, changeFrequency: 'weekly', priority: 1 });
    entries.push({ url: `${base}/${loc}/catalogue`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    for (const p of PRODUCTS) {
      entries.push({
        url: `${base}/${loc}/produit/${p.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }
  return entries;
}
