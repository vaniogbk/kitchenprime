import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from './i18n';

/**
 * Configuration de requête next-intl.
 *
 * Séparée de `lib/i18n.ts` — qui ne contient plus que des constantes — afin
 * que les tests unitaires et les modules purs (`lib/seo`, `lib/products`…)
 * n'entraînent pas `next-intl/server` dans leur graphe d'import.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` remplace le paramètre `locale`, déprécié depuis
  // next-intl 3.22. Il est asynchrone et peut être indéfini hors segment
  // de locale, d'où le repli explicite.
  const requested = await requestLocale;
  if (!isLocale(requested)) notFound();

  return {
    locale: requested,
    messages: (await import(`../messages/${requested}.json`)).default,
  };
});
