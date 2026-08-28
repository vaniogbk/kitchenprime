import type { IconName } from '@/components/ui/Icon';

export type Category = 'robots' | 'acc' | 'livres' | 'packs' | 'maison';
/** Habillage visuel du badge. */
export type BadgeKind = '' | 'new' | 'copper' | 'pack';
/** Clé sémantique du badge, traduite à l'affichage (`badges.*` dans les messages). */
export type BadgeKey = '' | 'new' | 'promo' | 'bestseller' | 'pack';

export type Product = {
  slug: string;
  /** Nom canonique (français) : sert de clé en base et dans les commandes. */
  name: string;
  category: Category;
  /** Marque, reprise telle quelle dans le JSON-LD Product. */
  brand: string;
  priceCents: number;        // prix de référence, en centimes
  oldPriceCents?: number;    // prix barré éventuel
  imageId: string;           // identifiant de photo Unsplash (sans préfixe)
  badge: BadgeKind;
  badgeKey: BadgeKey;
  rating: number;
  reviewsCount: number;
  ref: string;
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const raw: Array<Omit<Product, 'slug' | 'ref'>> = [
  // ── Robots culinaires ──────────────────────────────────────────────────────
  { name: 'Thermomix TM7',                  category: 'robots', brand: 'Thermomix', priceCents: 149900, oldPriceCents: 169900, imageId: 'photo-1556909114-f6e7ad7d3136', badge: 'new',    badgeKey: 'new',        rating: 4.9, reviewsCount: 2847 },
  { name: 'Thermomix TM6',                  category: 'robots', brand: 'Thermomix', priceCents: 129900,                        imageId: 'photo-1585515320310-259814833e62', badge: '',      badgeKey: '',           rating: 4.8, reviewsCount: 5210 },
  { name: 'Cookidoo · Abonnement 1 an',     category: 'robots', brand: 'Thermomix', priceCents:   4800,                        imageId: 'photo-1498837167922-ddd27525d352', badge: '',      badgeKey: '',           rating: 4.7, reviewsCount: 1890 },
  // ── Accessoires TM7 ───────────────────────────────────────────────────────
  { name: 'Kit Pâtisserie Pro',             category: 'acc',    brand: 'Thermomix', priceCents:   8900,                        imageId: 'photo-1565299624946-b28f40a0ae38', badge: '',      badgeKey: '',           rating: 4.7, reviewsCount: 421 },
  { name: 'Varoma XL Steam Set',            category: 'acc',    brand: 'Thermomix', priceCents:   6900, oldPriceCents:  8900,  imageId: 'photo-1591189863430-ab87e120f312', badge: 'copper', badgeKey: 'promo',     rating: 4.6, reviewsCount: 318 },
  { name: 'Couteau lame métal TM7',         category: 'acc',    brand: 'Thermomix', priceCents:   5900,                        imageId: 'photo-1593618998160-e34014e67546', badge: '',      badgeKey: '',           rating: 4.8, reviewsCount: 255 },
  { name: 'Bol mixeur secondaire',          category: 'acc',    brand: 'Thermomix', priceCents:  17900,                        imageId: 'photo-1574269909862-7e1d70bb8078', badge: '',      badgeKey: '',           rating: 4.9, reviewsCount: 180 },
  { name: 'Spatule Thermomix officielle',   category: 'acc',    brand: 'Thermomix', priceCents:   1900,                        imageId: 'photo-1556910103-1c02745aae4d',   badge: '',      badgeKey: '',           rating: 4.9, reviewsCount: 612 },
  { name: 'Panier de cuisson',              category: 'acc',    brand: 'Thermomix', priceCents:   2900,                        imageId: 'photo-1629570582511-bade3dd01d2e', badge: '',      badgeKey: '',           rating: 4.7, reviewsCount: 203 },
  { name: 'Sac de transport TM7',           category: 'acc',    brand: 'Thermomix', priceCents:   4900,                        imageId: 'photo-1553062407-98eeb64c6a62',   badge: '',      badgeKey: '',           rating: 4.6, reviewsCount: 97  },
  // ── Livres de recettes ────────────────────────────────────────────────────
  { name: '500 Recettes TM7',               category: 'livres', brand: 'Thermomix', priceCents:   4900,                        imageId: 'photo-1490645935967-10de6ba17061', badge: 'copper', badgeKey: 'bestseller', rating: 4.8, reviewsCount: 641 },
  { name: 'Pâtisserie TM7',                 category: 'livres', brand: 'Thermomix', priceCents:   3900,                        imageId: 'photo-1466637574441-749b8f19452f', badge: '',      badgeKey: '',           rating: 4.7, reviewsCount: 288 },
  { name: 'Cuisine du monde TM7',           category: 'livres', brand: 'Thermomix', priceCents:   3900,                        imageId: 'photo-1512621776951-a57141f2eefd', badge: '',      badgeKey: '',           rating: 4.6, reviewsCount: 174 },
  // ── Packs ─────────────────────────────────────────────────────────────────
  { name: 'Pack TM7 Essentiel',             category: 'packs',  brand: 'Thermomix', priceCents: 154900, oldPriceCents: 161700, imageId: 'photo-1556909172-54557c7e4fb7',   badge: 'pack',  badgeKey: 'pack',       rating: 4.9, reviewsCount: 302 },
  { name: 'Pack TM7 Pâtisserie',            category: 'packs',  brand: 'Thermomix', priceCents: 156900, oldPriceCents: 162700, imageId: 'photo-1606787366850-de6330128bfc', badge: 'pack', badgeKey: 'pack',       rating: 4.9, reviewsCount: 215 },
  { name: 'Pack TM7 Complet',               category: 'packs',  brand: 'Thermomix', priceCents: 169900, oldPriceCents: 195600, imageId: 'photo-1565299624946-b28f40a0ae38', badge: 'pack', badgeKey: 'pack',       rating: 5.0, reviewsCount: 412 },
  // ── Maison & électroménager ───────────────────────────────────────────────
  // Ajoutés en fin de tableau : les réf. dérivent de l'index global, une
  // insertion au milieu renumériserait des références déjà vendues.
  { name: 'Samsung Family Hub',             category: 'maison', brand: 'Samsung',   priceCents: 149000,                        imageId: 'photo-1643356472833-5b1f2cd4ca3c', badge: 'new',    badgeKey: 'new',       rating: 4.7, reviewsCount: 512 },
  { name: 'Thermostat Nest',                category: 'maison', brand: 'Google Nest', priceCents: 17000,                       imageId: 'photo-1545259741-2ea3ebf61fa3',   badge: '',      badgeKey: '',          rating: 4.6, reviewsCount: 1204 },
  { name: 'Dyson Hot+Cool',                 category: 'maison', brand: 'Dyson',     priceCents:  40000,                        imageId: 'photo-1768471569643-717e823b5f9a', badge: '',      badgeKey: '',          rating: 4.7, reviewsCount: 863 },
  { name: 'Ninja Creami',                   category: 'maison', brand: 'Ninja',     priceCents:  39900, oldPriceCents:  64900, imageId: 'photo-1628815870980-f416105d89b3', badge: 'copper', badgeKey: 'promo',    rating: 4.8, reviewsCount: 391 },
];

const refPrefix: Record<Category, string> = {
  robots: 'ROB',
  acc: 'ACC',
  livres: 'LIV',
  packs: 'PCK',
  maison: 'MAI',
};

export const PRODUCTS: Product[] = raw.map((p, i) => ({
  ...p,
  slug: slugify(p.name),
  ref: `${refPrefix[p.category]}-${String(i + 1).padStart(3, '0')}`,
}));

export const getProductBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const getProductsByCategory = (cat?: Category) =>
  cat ? PRODUCTS.filter((p) => p.category === cat) : PRODUCTS;

/** Économie réalisée sur un produit remisé, en euros entiers. */
export const savingsEuros = (p: Product) =>
  p.oldPriceCents ? Math.round((p.oldPriceCents - p.priceCents) / 100) : 0;

export const formatEUR = (cents: number, locale: string = 'fr-FR') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

export const unsplashUrl = (id: string, width = 500, q = 75) =>
  `https://images.unsplash.com/${id}?w=${width}&q=${q}`;

export const categoryIcon = (cat: Category): IconName => {
  switch (cat) {
    case 'robots': return 'blender';
    case 'acc': return 'kitchen-set';
    case 'livres': return 'book-open';
    case 'packs': return 'boxes-stacked';
    case 'maison': return 'house';
  }
};
