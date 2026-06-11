export type Category = 'robots' | 'acc' | 'livres' | 'packs';
export type BadgeKind = '' | 'new' | 'copper' | 'pack';

export type Product = {
  slug: string;
  name: string;
  category: Category;
  priceCents: number;        // canonical price in cents
  oldPriceCents?: number;    // for promo display
  imageId: string;           // Unsplash photo id (without prefix)
  badge: BadgeKind;
  badgeLabel: string;
  rating: number;
  reviewsCount: number;
  ref: string;
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const raw: Array<Omit<Product, 'slug' | 'ref'>> = [
  // ── Robots culinaires ──────────────────────────────────────────────────────
  { name: 'Thermomix TM7',                  category: 'robots', priceCents: 149900, oldPriceCents: 169900, imageId: 'KfouZ7nkiho',                        badge: 'new',    badgeLabel: 'Nouveau',     rating: 4.9, reviewsCount: 2847 },
  { name: 'Thermomix TM6',                  category: 'robots', priceCents: 129900,                         imageId: 'XbTJE_Ul41U',                        badge: '',       badgeLabel: '',            rating: 4.8, reviewsCount: 5210 },
  { name: 'Cookidoo · Abonnement 1 an',     category: 'robots', priceCents:   4800,                         imageId: 'photo-1498837167922-ddd27525d352',   badge: '',       badgeLabel: '',            rating: 4.7, reviewsCount: 1890 },
  // ── Accessoires TM7 ───────────────────────────────────────────────────────
  { name: 'Kit Pâtisserie Pro',             category: 'acc',    priceCents:   8900,                         imageId: 'xEZR4-kYhgM',                        badge: '',       badgeLabel: '',            rating: 4.7, reviewsCount: 421 },
  { name: 'Varoma XL Steam Set',            category: 'acc',    priceCents:   6900, oldPriceCents:  8900,   imageId: 'Jinnqw9bHjI',                        badge: 'copper', badgeLabel: 'Promo',       rating: 4.6, reviewsCount: 318 },
  { name: 'Couteau lame métal TM7',         category: 'acc',    priceCents:   5900,                         imageId: 'f4jl2ezowuM',                        badge: '',       badgeLabel: '',            rating: 4.8, reviewsCount: 255 },
  { name: 'Bol mixeur secondaire',          category: 'acc',    priceCents:  17900,                         imageId: 'VghP75yXtWE',                        badge: '',       badgeLabel: '',            rating: 4.9, reviewsCount: 180 },
  { name: 'Spatule Thermomix officielle',   category: 'acc',    priceCents:   1900,                         imageId: 'm3jtY6EobzM',                        badge: '',       badgeLabel: '',            rating: 4.9, reviewsCount: 612 },
  { name: 'Panier de cuisson',              category: 'acc',    priceCents:   2900,                         imageId: '5E0d3lfoC1w',                        badge: '',       badgeLabel: '',            rating: 4.7, reviewsCount: 203 },
  { name: 'Sac de transport TM7',           category: 'acc',    priceCents:   4900,                         imageId: 'photo-1553062407-98eeb64c6a62',      badge: '',       badgeLabel: '',            rating: 4.6, reviewsCount: 97 },
  // ── Livres de recettes ────────────────────────────────────────────────────
  { name: '500 Recettes TM7',               category: 'livres', priceCents:   4900,                         imageId: 'QkyRG0bB_xg',                        badge: 'copper', badgeLabel: 'Best-seller', rating: 4.8, reviewsCount: 641 },
  { name: 'Pâtisserie TM7',                 category: 'livres', priceCents:   3900,                         imageId: 'hwy3W3qFjgM',                        badge: '',       badgeLabel: '',            rating: 4.7, reviewsCount: 288 },
  { name: 'Cuisine du monde TM7',           category: 'livres', priceCents:   3900,                         imageId: 'photo-1512621776951-a57141f2eefd',   badge: '',       badgeLabel: '',            rating: 4.6, reviewsCount: 174 },
  // ── Packs ─────────────────────────────────────────────────────────────────
  { name: 'Pack TM7 Essentiel',             category: 'packs',  priceCents: 154900, oldPriceCents: 161700,  imageId: 'O78kGuS079Y',                        badge: 'pack',   badgeLabel: 'Pack −€68',   rating: 4.9, reviewsCount: 302 },
  { name: 'Pack TM7 Pâtisserie',            category: 'packs',  priceCents: 156900, oldPriceCents: 162700,  imageId: 'eNBXKqj-88M',                        badge: 'pack',   badgeLabel: 'Pack −€58',   rating: 4.9, reviewsCount: 215 },
  { name: 'Pack TM7 Complet',               category: 'packs',  priceCents: 169900, oldPriceCents: 195600,  imageId: '9gtiGV76NnM',                        badge: 'pack',   badgeLabel: 'Pack −€257',  rating: 5.0, reviewsCount: 412 },
];

const refPrefix: Record<Category, string> = {
  robots: 'ROB',
  acc: 'ACC',
  livres: 'LIV',
  packs: 'PCK',
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

export const formatEUR = (cents: number, locale: string = 'fr-FR') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

export const unsplashUrl = (id: string, width = 500, q = 75) =>
  `https://images.unsplash.com/${id}?w=${width}&q=${q}`;

export const categoryIcon = (cat: Category) => {
  switch (cat) {
    case 'robots': return 'fa-blender';
    case 'acc': return 'fa-kitchen-set';
    case 'livres': return 'fa-book-open';
    case 'packs': return 'fa-boxes-stacked';
  }
};
