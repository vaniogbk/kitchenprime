/**
 * Lighthouse CI — audit de performance, accessibilité, bonnes pratiques et SEO.
 *
 * Lancement : `npm run build:e2e && npm run test:lighthouse`
 *
 * Répartition des seuils, volontairement asymétrique :
 *
 * • **Bloquants** — accessibilité, bonnes pratiques, SEO et CLS. Ce sont des
 *   critères structurels, déterministes, et le site les tient à 100. Une
 *   régression y est un vrai défaut, jamais un aléa de mesure.
 *
 * • **Avertissements** — score de performance, LCP, TBT, Speed Index. Ces
 *   mesures dépendent de la charge de la machine et, pour le LCP, de la
 *   latence d'Unsplash au premier appel de l'optimiseur d'images. Sur un
 *   même build, elles varient ici de 31 à 90 selon ce qui tourne à côté :
 *   en faire des seuils bloquants rendrait la CI instable sans rien dire
 *   d'utile sur le code. Elles restent affichées et suivies.
 */
const PORT = process.env.E2E_PORT ?? 3178;
const BASE = `http://localhost:${PORT}`;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx next start -p ${PORT}`,
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 120000,
      url: [
        `${BASE}/fr`,
        `${BASE}/fr/catalogue`,
        `${BASE}/fr/produit/thermomix-tm7`,
        `${BASE}/de/produit/samsung-family-hub`,
        `${BASE}/fr/cgv`,
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // L'installabilité PWA n'est pas un objectif : la boutique ne prétend
        // pas être une application installable.
        skipAudits: ['installable-manifest', 'maskable-icon', 'splash-screen', 'themed-omnibox'],
      },
    },

    assert: {
      assertions: {
        /* ── Bloquants ────────────────────────────────────────────────── */
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Points SEO structurels : aucune tolérance.
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'hreflang': 'error',
        'canonical': 'error',
        'image-alt': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'heading-order': 'error',
        'color-contrast': 'error',
        'target-size': 'error',

        // Décisions d'architecture qu'on ne veut pas voir revenir en arrière :
        // aucune feuille de style tierce bloquant le rendu.
        'render-blocking-resources': ['error', { maxNumericValue: 200 }],

        /* ── Avertissements (sensibles à l'environnement) ─────────────── */
        'categories:performance': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        'uses-responsive-images': 'warn',
        'modern-image-formats': 'warn',
        'unused-javascript': 'warn',
        'legacy-javascript': 'warn',

        /* ── Hors périmètre ───────────────────────────────────────────── */
        // Unsplash impose son propre TTL de cache.
        'uses-long-cache-ttl': 'off',
        // Les visuels utilisent le mode `fill` de next/image : la hauteur est
        // réservée par le ratio du conteneur, pas par des attributs.
        'unsized-images': 'off',
        // `next start` sert le document avec `cache-control: no-store` ;
        // en production, le CDN place ses propres en-têtes.
        'bf-cache': 'off',
      },
    },

    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
};
