import type { MetadataRoute } from 'next';
import { absoluteUrl, siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Pages sans valeur d'entrée : elles consommeraient du budget
        // d'exploration sans jamais pouvoir se positionner.
        disallow: ['/api/', '/admin', '/admin/', '/*/checkout', '/*/panier', '/*/favoris'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl(),
  };
}
