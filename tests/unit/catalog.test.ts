import { describe, it, expect } from 'vitest';
import {
  PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
  formatEUR,
  savingsEuros,
  categoryIcon,
  type Category,
} from '@/lib/products';
import { ICONS } from '@/components/ui/icons.generated';

const CATEGORIES: Category[] = ['robots', 'acc', 'livres', 'packs', 'maison'];

describe('catalogue', () => {
  it('contient les 20 produits annoncés dans les libellés de catalogue', () => {
    // Le texte « Catalogue complet · 20 produits » est en dur dans les
    // traductions : ce test empêche qu'il redevienne faux.
    expect(PRODUCTS).toHaveLength(20);
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

  it('garde des notes dans l’échelle 0–5 et des compteurs d’avis positifs', () => {
    for (const p of PRODUCTS) {
      expect(p.rating).toBeGreaterThan(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.reviewsCount).toBeGreaterThanOrEqual(0);
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
