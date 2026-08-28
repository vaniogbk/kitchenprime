import { describe, it, expect } from 'vitest';
import { locales, defaultLocale, isLocale, type Locale } from '@/lib/i18n';
import { PRODUCTS } from '@/lib/products';
import { getProductContent, missingContent } from '@/lib/product-content';
import { getLegal } from '@/content/legal';

// Préfixés : `it` entrerait en collision avec le `it()` de Vitest.
import msgFr from '@/messages/fr.json';
import msgDe from '@/messages/de.json';
import msgIt from '@/messages/it.json';
import msgEn from '@/messages/en.json';

const BUNDLES: Record<Locale, unknown> = { fr: msgFr, de: msgDe, it: msgIt, en: msgEn };

/** Aplatit un objet de messages en chemins pointés. */
function flatten(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    v !== null && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

/**
 * Extrait les noms d'arguments ICU d'un message.
 *
 * L'argument doit être immédiatement suivi de `,` ou `}` : sans cette
 * contrainte, les corps de branches d'un pluriel (`one {1 produit}`) seraient
 * pris pour des variables et les langues sembleraient diverger à tort.
 */
function placeholders(msg: string): Set<string> {
  return new Set([...msg.matchAll(/\{\s*([a-zA-Z_]\w*)\s*[,}]/g)].map((m) => m[1]));
}

function valueAt(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (acc, k) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined),
    obj,
  );
}

describe('locales', () => {
  it('inclut la locale par défaut', () => {
    expect(locales).toContain(defaultLocale);
  });

  it('reconnaît les locales valides et rejette le reste', () => {
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('es')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });
});

describe('fichiers de messages', () => {
  const reference = flatten(msgFr).sort();

  it('expose exactement les mêmes clés dans les 4 langues', () => {
    for (const l of locales) {
      const keys = flatten(BUNDLES[l]).sort();
      const missing = reference.filter((k) => !keys.includes(k));
      const extra = keys.filter((k) => !reference.includes(k));
      expect(missing, `clés manquantes en ${l}`).toEqual([]);
      expect(extra, `clés en trop en ${l}`).toEqual([]);
    }
  });

  it('ne laisse aucun message vide', () => {
    for (const l of locales) {
      for (const key of reference) {
        const v = valueAt(BUNDLES[l], key);
        expect(typeof v === 'string' && v.trim() !== '', `${l}.${key} est vide`).toBe(true);
      }
    }
  });

  it('conserve les mêmes variables ICU d’une langue à l’autre', () => {
    // Un {count} oublié dans une traduction s'affiche littéralement en
    // production : le test l'attrape avant.
    for (const key of reference) {
      const expected = placeholders(String(valueAt(msgFr, key)));
      for (const l of locales) {
        const got = placeholders(String(valueAt(BUNDLES[l], key)));
        expect([...got].sort(), `variables divergentes sur ${l}.${key}`).toEqual([...expected].sort());
      }
    }
  });
});

describe('contenu produit', () => {
  it('couvre chaque produit dans chaque langue', () => {
    expect(missingContent()).toEqual([]);
  });

  it('fournit un nom, une accroche, une description et 4 points clés', () => {
    for (const p of PRODUCTS) {
      for (const l of locales) {
        const c = getProductContent(p.slug, l);
        expect(c.name.trim(), `nom vide ${p.slug}/${l}`).not.toBe('');
        expect(c.tagline.trim(), `accroche vide ${p.slug}/${l}`).not.toBe('');
        expect(c.description.length, `description trop courte ${p.slug}/${l}`).toBeGreaterThan(120);
        expect(c.features, `points clés ${p.slug}/${l}`).toHaveLength(4);
        for (const f of c.features) expect(f.trim()).not.toBe('');
      }
    }
  });

  it('garde des accroches compatibles avec une meta description', () => {
    // Google tronque au-delà d'environ 160 caractères.
    for (const p of PRODUCTS) {
      for (const l of locales) {
        const { tagline } = getProductContent(p.slug, l);
        expect(tagline.length, `accroche trop longue ${p.slug}/${l} (${tagline.length})`).toBeLessThanOrEqual(160);
      }
    }
  });

  it('traduit réellement les descriptions au lieu de recopier le français', () => {
    for (const p of PRODUCTS) {
      const base = getProductContent(p.slug, 'fr').description;
      for (const l of locales.filter((x) => x !== 'fr')) {
        expect(
          getProductContent(p.slug, l).description,
          `${p.slug}/${l} est identique au français`,
        ).not.toBe(base);
      }
    }
  });
});

describe('pages légales', () => {
  it('existent dans les 4 langues avec des sections non vides', () => {
    for (const l of locales) {
      const legal = getLegal(l);
      for (const key of ['cgv', 'legal', 'returns', 'contact'] as const) {
        const page = legal[key];
        expect(page.title.trim(), `titre vide ${key}/${l}`).not.toBe('');
        expect(page.sections.length, `aucune section ${key}/${l}`).toBeGreaterThan(0);
        for (const s of page.sections) {
          expect(s.h.trim()).not.toBe('');
          expect(s.blocks.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('n’expose pas de texte français sur les autres langues', () => {
    // Contrôle grossier mais efficace : les titres doivent différer du français.
    for (const l of locales.filter((x) => x !== 'fr')) {
      expect(getLegal(l).cgv.title, `CGV non traduites en ${l}`).not.toBe(getLegal('fr').cgv.title);
      expect(getLegal(l).returns.title, `retours non traduits en ${l}`).not.toBe(getLegal('fr').returns.title);
    }
  });

  it('pointe les liens internes vers la bonne locale', () => {
    for (const l of locales) {
      const texts = getLegal(l).contact.sections
        .flatMap((s) => s.blocks)
        .flatMap((b) => (b.t === 'p' ? [b.text] : b.items));
      for (const text of texts) {
        for (const [, href] of text.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g)) {
          expect(href, `lien interne hors locale en ${l}`).toMatch(new RegExp(`^/${l}/`));
        }
      }
    }
  });
});
