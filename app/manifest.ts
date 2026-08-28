import type { MetadataRoute } from 'next';
import { defaultLocale } from '@/lib/i18n';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KitchenPrime — Thermomix TM7, électroménager & maison connectée',
    short_name: 'KitchenPrime',
    description:
      'Thermomix TM7 reconditionné, électroménager et maison connectée. Livraison gratuite 48 h en Europe, garantie 24 mois.',
    start_url: `/${defaultLocale}`,
    display: 'standalone',
    background_color: '#F7F8FD',
    theme_color: '#3D4DB8',
    lang: defaultLocale,
    categories: ['shopping', 'food'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
