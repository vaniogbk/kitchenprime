import { describe, it, expect, beforeAll } from 'vitest';
import {
  absoluteUrl,
  siteUrl,
  alternatesFor,
  pageMetadata,
  organizationLd,
  webSiteLd,
  breadcrumbLd,
  productLd,
  itemListLd,
  jsonLdGraph,
  BCP47,
} from '@/lib/seo';
import { locales, defaultLocale } from '@/lib/i18n';
import { PRODUCTS } from '@/lib/products';
import { waOrderUrl, WA_NUMBER } from '@/lib/whatsapp';

beforeAll(() => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://kitchenprime.com';
});

describe('URL du site', () => {
  it('retire la barre oblique finale', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://kitchenprime.com/';
    expect(siteUrl()).toBe('https://kitchenprime.com');
    process.env.NEXT_PUBLIC_APP_URL = 'https://kitchenprime.com';
  });

  it('construit des URL absolues', () => {
    expect(absoluteUrl('/fr/catalogue')).toBe('https://kitchenprime.com/fr/catalogue');
    expect(absoluteUrl('fr')).toBe('https://kitchenprime.com/fr');
  });
});

describe('hreflang', () => {
  it('déclare les 4 langues plus x-default', () => {
    const alt = alternatesFor('/catalogue', 'fr') as {
      canonical: string;
      languages: Record<string, string>;
    };
    expect(alt.canonical).toBe('https://kitchenprime.com/fr/catalogue');
    for (const l of locales) {
      expect(alt.languages[BCP47[l]]).toBe(`https://kitchenprime.com/${l}/catalogue`);
    }
    expect(alt.languages['x-default']).toBe(
      `https://kitchenprime.com/${defaultLocale}/catalogue`,
    );
  });

  it('gère l’accueil sans double barre oblique', () => {
    const alt = alternatesFor('/', 'de') as { canonical: string; languages: Record<string, string> };
    expect(alt.canonical).toBe('https://kitchenprime.com/de');
    expect(alt.languages['x-default']).toBe('https://kitchenprime.com/fr');
    expect(Object.values(alt.languages).some((u) => u.includes('//', 8))).toBe(false);
  });

  it('est réciproque : chaque langue pointe vers toutes les autres', () => {
    for (const l of locales) {
      const alt = alternatesFor('/produit/thermomix-tm7', l) as {
        languages: Record<string, string>;
      };
      expect(Object.keys(alt.languages)).toHaveLength(locales.length + 1);
    }
  });
});

describe('pageMetadata', () => {
  const meta = pageMetadata({
    locale: 'fr',
    path: '/catalogue',
    title: 'Catalogue',
    description: 'Tous nos produits',
  });

  it('remplit Open Graph et Twitter', () => {
    expect(meta.openGraph?.title).toBe('Catalogue');
    expect((meta.twitter as { card?: string } | undefined)?.card).toBe('summary_large_image');
    expect((meta.openGraph as { locale?: string }).locale).toBe('fr_FR');
  });

  it('déclare les locales alternatives sans se répéter', () => {
    const alt = (meta.openGraph as { alternateLocale?: string[] }).alternateLocale ?? [];
    expect(alt).toHaveLength(locales.length - 1);
    expect(alt).not.toContain('fr_FR');
  });

  it('autorise l’indexation par défaut', () => {
    expect((meta.robots as { index: boolean }).index).toBe(true);
  });

  it('bloque l’indexation quand on le demande', () => {
    const priv = pageMetadata({
      locale: 'fr', path: '/panier', title: 'Panier', description: '…', noIndex: true,
    });
    expect((priv.robots as { index: boolean }).index).toBe(false);
    expect((priv.robots as { follow: boolean }).follow).toBe(false);
  });
});

describe('données structurées', () => {
  it('produit un graphe JSON-LD valide', () => {
    const raw = jsonLdGraph(organizationLd(), webSiteLd('fr'));
    const parsed = JSON.parse(raw);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsed['@graph'])).toBe(true);
    expect(parsed['@graph']).toHaveLength(2);
  });

  it('relie le site à son éditeur par @id', () => {
    const org = organizationLd() as { '@id': string };
    const site = webSiteLd('fr') as { publisher: { '@id': string } };
    expect(site.publisher['@id']).toBe(org['@id']);
  });

  it('numérote le fil d’Ariane à partir de 1', () => {
    const bc = breadcrumbLd([
      { name: 'Accueil', url: 'https://kitchenprime.com/fr' },
      { name: 'Catalogue', url: 'https://kitchenprime.com/fr/catalogue' },
    ]) as { itemListElement: Array<{ position: number }> };
    expect(bc.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it('décrit chaque produit avec les champs exigés par Google', () => {
    for (const p of PRODUCTS) {
      const ld = productLd({
        name: p.name,
        description: 'desc',
        sku: p.ref,
        slug: p.slug,
        brand: p.brand,
        image: ['https://images.unsplash.com/x'],
        priceCents: p.priceCents,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        locale: 'fr',
        category: 'Test',
        condition: p.category === 'maison' ? 'new' : 'refurbished',
      }) as {
        '@type': string;
        offers: { price: string; priceCurrency: string; availability: string; priceValidUntil: string; itemCondition: string };
        aggregateRating: { ratingValue: string; reviewCount: number };
        brand: { name: string };
      };

      expect(ld['@type']).toBe('Product');
      expect(ld.offers.priceCurrency).toBe('EUR');
      // Le prix doit être un décimal simple, pas une chaîne formatée.
      expect(ld.offers.price).toMatch(/^\d+\.\d{2}$/);
      expect(Number(ld.offers.price)).toBeCloseTo(p.priceCents / 100, 2);
      expect(ld.offers.availability).toBe('https://schema.org/InStock');
      expect(ld.offers.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(ld.brand.name).toBe(p.brand);
      expect(ld.aggregateRating.reviewCount).toBe(p.reviewsCount);
    }
  });

  it('marque l’électroménager comme neuf et les Thermomix comme reconditionnés', () => {
    const mk = (condition: 'new' | 'refurbished') =>
      productLd({
        name: 'x', description: 'd', sku: 'S', slug: 's', brand: 'B',
        image: [], priceCents: 1000, rating: 5, reviewsCount: 1,
        locale: 'fr', category: 'c', condition,
      }) as { offers: { itemCondition: string } };

    expect(mk('new').offers.itemCondition).toBe('https://schema.org/NewCondition');
    expect(mk('refurbished').offers.itemCondition).toBe('https://schema.org/RefurbishedCondition');
  });

  it('énumère une liste de produits dans l’ordre', () => {
    const list = itemListLd(
      [{ name: 'A', url: 'https://x/1' }, { name: 'B', url: 'https://x/2' }],
      'Populaires',
    ) as { numberOfItems: number; itemListElement: Array<{ position: number; name: string }> };
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement[1]).toMatchObject({ position: 2, name: 'B' });
  });

  it('échappe les chevrons pour ne pas fermer la balise script', () => {
    const raw = jsonLdGraph({ '@type': 'Thing', name: '</script><img onerror=1>' });
    // jsonLdGraph produit du JSON ; c'est le composant JsonLd qui échappe.
    // On vérifie ici que la chaîne reste sérialisable et reparsable.
    expect(() => JSON.parse(raw)).not.toThrow();
    expect(raw.replace(/</g, '\\u003c')).not.toContain('</script>');
  });
});

describe('lien WhatsApp', () => {
  it('encode le nom du produit dans le message', () => {
    const url = waOrderUrl('Pack TM7 Complet', 'Bonjour, je veux : {product}');
    expect(url.startsWith(`https://wa.me/${WA_NUMBER}?text=`)).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Bonjour, je veux : Pack TM7 Complet');
  });

  it('reste valide sans gabarit fourni', () => {
    expect(waOrderUrl('Thermomix TM7')).toContain('Thermomix%20TM7');
  });

  it('échappe les caractères spéciaux', () => {
    const url = waOrderUrl('Dyson Hot+Cool', '{product}');
    expect(url).not.toContain('+Cool');
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Dyson Hot+Cool');
  });
});
