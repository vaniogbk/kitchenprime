import { describe, it, expect } from 'vitest';
import {
  PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
  formatEUR,
  savingsEuros,
  categoryIcon,
  hasReviews,
  type Category,
} from '@/lib/products';
import fr from '@/messages/fr.json';
import de from '@/messages/de.json';
import it_ from '@/messages/it.json';
import en from '@/messages/en.json';
import { ICONS } from '@/components/ui/icons.generated';

const CATEGORIES: Category[] = ['robots', 'acc', 'livres', 'packs', 'maison'];

describe('catalogue', () => {
  it('ne fige aucun nombre de produits dans les libellés', () => {
    // Le compte était écrit en dur (« 20 produits ») et devenait faux à chaque
    // ajout. Les libellés reçoivent désormais {count} : on vérifie qu'aucun
    // nombre ne s'y est réinstallé.
    const keys = [
      ['meta', 'catalogTitle'], ['meta', 'catalogDesc'], ['home', 'seeAll'],
      ['catalog', 'eyebrow'], ['catalog', 'subtitle'],
    ] as const;
    for (const msgs of [fr, de, it_, en] as Array<Record<string, Record<string, string>>>) {
      for (const [ns, key] of keys) {
        expect(msgs[ns][key], `${ns}.${key}`).toContain('{count}');
      }
    }
  });

  it('contient 27 produits', () => {
    expect(PRODUCTS).toHaveLength(27);
  });

  it('n’a aucun slug en double', () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('n’a aucune référence en double', () => {
    const refs = PRODUCTS.map((p) => p.ref);
    expect(new Set(refs).size).toBe(refs.length);
  });

  it('produit des slugs utilisables en URL', () => {
    for (const p of PRODUCTS) {
      expect(p.slug, `slug invalide pour ${p.name}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('utilise le préfixe de référence de sa catégorie', () => {
    const prefix: Record<Category, string> = {
      robots: 'ROB', acc: 'ACC', livres: 'LIV', packs: 'PCK', maison: 'MAI',
    };
    for (const p of PRODUCTS) {
      expect(p.ref.startsWith(prefix[p.category]), `${p.ref} ≠ ${p.category}`).toBe(true);
    }
  });

  it('a des prix strictement positifs et entiers (centimes)', () => {
    for (const p of PRODUCTS) {
      expect(Number.isInteger(p.priceCents)).toBe(true);
      expect(p.priceCents).toBeGreaterThan(0);
    }
  });

  it('n’affiche jamais un prix barré inférieur au prix de vente', () => {
    for (const p of PRODUCTS) {
      if (p.oldPriceCents !== undefined) {
        expect(p.oldPriceCents, `prix barré incohérent sur ${p.slug}`).toBeGreaterThan(p.priceCents);
      }
    }
  });

  it('garde des notes dans l’échelle 0–5', () => {
    for (const p of PRODUCTS) {
      expect(p.rating).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.reviewsCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('n’associe jamais une note à zéro avis, ni l’inverse', () => {
    // Une note sans avis, c'est une note inventée : le site ne l'affiche pas
    // et ne la transmet pas à Google. Les deux champs vont donc de pair.
    for (const p of PRODUCTS) {
      expect(p.rating > 0, `${p.slug} : note et nombre d’avis désaccordés`).toBe(p.reviewsCount > 0);
      expect(hasReviews(p)).toBe(p.reviewsCount > 0);
    }
  });

  it('n’attribue aucune note aux produits ajoutés après coup', () => {
    // Aucun avis n'a été recueilli pour eux : toute note serait fictive.
    const added = [
      'samsung-family-hub', 'thermostat-nest', 'dyson-hot-cool', 'ninja-creami',
      'couvercle-de-bol-melangeur', 'protege-lame-et-eplucheur', 'pare-eclaboussures',
      'couvercle-transparent-varoma', 'kit-sous-vide-pompe-et-sachets',
      'tapis-a-patisserie', 'moule-a-pain',
    ];
    for (const slug of added) {
      const p = getProductBySlug(slug);
      expect(p, `${slug} introuvable`).toBeDefined();
      expect(hasReviews(p!), `${slug} affiche une note sans avis`).toBe(false);
    }
  });

  it('associe une icône existante à chaque catégorie', () => {
    for (const c of CATEGORIES) {
      expect(ICONS[categoryIcon(c)], `icône manquante pour ${c}`).toBeDefined();
    }
  });

  it('n’affiche un badge que lorsqu’une clé sémantique l’accompagne', () => {
    for (const p of PRODUCTS) {
      expect(Boolean(p.badge), `badge/badgeKey désaccordés sur ${p.slug}`).toBe(Boolean(p.badgeKey));
    }
  });

  it('renseigne une marque sur chaque produit', () => {
    for (const p of PRODUCTS) {
      expect(p.brand.trim().length, `marque manquante sur ${p.slug}`).toBeGreaterThan(0);
    }
  });

  it('contient bien les produits ajoutés en dernier', () => {
    for (const slug of ['samsung-family-hub', 'thermostat-nest', 'dyson-hot-cool', 'ninja-creami']) {
      expect(getProductBySlug(slug), `${slug} introuvable`).toBeDefined();
    }
  });

  it('applique la remise demandée sur le Ninja Creami', () => {
    const creami = getProductBySlug('ninja-creami')!;
    expect(savingsEuros(creami)).toBe(250);
  });
});

describe('getProductBySlug', () => {
  it('retrouve un produit existant', () => {
    expect(getProductBySlug('thermomix-tm7')?.name).toBe('Thermomix TM7');
  });

  it('renvoie undefined pour un slug inconnu', () => {
    expect(getProductBySlug('nope')).toBeUndefined();
  });
});

describe('getProductsByCategory', () => {
  it('filtre sur la catégorie demandée', () => {
    const maison = getProductsByCategory('maison');
    expect(maison.length).toBe(4);
    expect(maison.every((p) => p.category === 'maison')).toBe(true);
  });

  it('renvoie tout le catalogue sans argument', () => {
    expect(getProductsByCategory()).toHaveLength(PRODUCTS.length);
  });
});

describe('formatEUR', () => {
  it('masque les décimales sur un montant rond', () => {
    // Espaces insécables : on normalise avant comparaison.
    expect(formatEUR(149900, 'fr-FR').replace(/\s/g, ' ')).toBe('1 499 €');
  });

  it('affiche les centimes quand il y en a', () => {
    expect(formatEUR(149950, 'fr-FR')).toMatch(/50/);
  });

  it('respecte les conventions locales', () => {
    const de = formatEUR(149900, 'de-DE');
    const en = formatEUR(149900, 'en-GB');
    expect(de).toContain('€');
    expect(en).toContain('€');
    // L'anglais place le symbole avant le nombre, l'allemand après.
    expect(en.trim().startsWith('€')).toBe(true);
    expect(de.trim().endsWith('€')).toBe(true);
  });
});

describe('savingsEuros', () => {
  it('renvoie 0 sans prix barré', () => {
    expect(savingsEuros({ priceCents: 1000 } as never)).toBe(0);
  });

  it('calcule l’écart en euros entiers', () => {
    expect(savingsEuros({ priceCents: 154900, oldPriceCents: 161700 } as never)).toBe(68);
  });
});
