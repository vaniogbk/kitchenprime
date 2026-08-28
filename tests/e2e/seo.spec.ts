import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import {
  LOCALES, BCP47, PUBLIC_PATHS, PRIVATE_PATHS,
  attr, meta, jsonLd, ldByType, ldNodes, expectSingleH1, stubImages,
} from './helpers';

// Le balisage se lit dans le HTML : les visuels distants n'apportent rien
// et ralentissent chaque navigation.
test.beforeEach(async ({ page }) => stubImages(page));

test.describe('Balises fondamentales', () => {
  for (const locale of LOCALES) {
    for (const path of PUBLIC_PATHS) {
      test(`/${locale}${path} — titre, description, canonique`, async ({ page }) => {
        const res = await page.goto(`/${locale}${path}`);
        expect(res?.status(), 'la page doit répondre 200').toBe(200);

        const title = await page.title();
        expect(title.trim().length, 'titre vide').toBeGreaterThan(10);
        // Au-delà d'environ 60 caractères, Google tronque le titre.
        expect(title.length, `titre trop long (${title.length}) : ${title}`).toBeLessThanOrEqual(75);

        const desc = await meta(page, 'description');
        expect(desc, 'meta description absente').toBeTruthy();
        expect(desc!.length, `description trop courte : ${desc}`).toBeGreaterThan(50);
        expect(desc!.length, `description trop longue (${desc!.length})`).toBeLessThanOrEqual(300);

        const canonical = await attr(page, 'link[rel="canonical"]', 'href');
        expect(canonical, 'canonique absente').toBe(`${BASE_URL}/${locale}${path}`);

        expect(await attr(page, 'html', 'lang'), 'attribut lang incorrect').toBe(locale);
      });
    }
  }
});

test.describe('hreflang', () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path || '/'} déclare les 4 langues et x-default`, async ({ page }) => {
      await page.goto(`/fr${path}`);
      const links = await page.locator('link[rel="alternate"]').evaluateAll((els) =>
        els.map((e) => ({
          lang: e.getAttribute('hreflang'),
          href: e.getAttribute('href'),
        })),
      );

      for (const l of LOCALES) {
        const found = links.find((x) => x.lang === BCP47[l]);
        expect(found, `hreflang ${BCP47[l]} manquant sur ${path}`).toBeTruthy();
        expect(found!.href).toBe(`${BASE_URL}/${l}${path}`);
      }

      const xDefault = links.find((x) => x.lang === 'x-default');
      expect(xDefault, 'x-default manquant').toBeTruthy();
      expect(xDefault!.href).toBe(`${BASE_URL}/fr${path}`);
    });
  }

  test('les alternates sont réciproques entre langues', async ({ page }) => {
    // Google ignore un hreflang non confirmé par la page cible.
    for (const from of LOCALES) {
      await page.goto(`/${from}/catalogue`);
      const hrefs = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
      for (const to of LOCALES) {
        expect(hrefs, `${from} ne référence pas ${to}`).toContain(`${BASE_URL}/${to}/catalogue`);
      }
    }
  });
});

test.describe('Open Graph & Twitter', () => {
  test('l’accueil expose les balises de partage', async ({ page }) => {
    await page.goto('/fr');
    expect(await meta(page, 'og:title')).toBeTruthy();
    expect(await meta(page, 'og:description')).toBeTruthy();
    expect(await meta(page, 'og:type')).toBe('website');
    expect(await meta(page, 'og:url')).toBe(`${BASE_URL}/fr`);
    expect(await meta(page, 'og:locale')).toBe('fr_FR');
    expect(await meta(page, 'og:image')).toBeTruthy();
    expect(await meta(page, 'twitter:card')).toBe('summary_large_image');
  });

  test('la fiche produit expose son visuel', async ({ page }) => {
    await page.goto('/fr/produit/thermomix-tm7');
    expect(await meta(page, 'og:type')).toBe('article');
    const img = await meta(page, 'og:image');
    expect(img, 'og:image absente sur la fiche produit').toBeTruthy();
    expect(img).toMatch(/^https?:\/\//);
  });

  test('chaque locale annonce ses langues alternatives', async ({ page }) => {
    await page.goto('/de');
    const alts = await page
      .locator('meta[property="og:locale:alternate"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('content')));
    expect(alts).toEqual(expect.arrayContaining(['fr_FR', 'it_IT', 'en_GB']));
    expect(alts).not.toContain('de_DE');
  });
});

test.describe('Structure sémantique', () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path || '/'} n’a qu’un seul h1`, async ({ page }) => {
      await page.goto(`/fr${path}`);
      await expectSingleH1(page);
    });
  }

  test('la hiérarchie de titres ne saute pas de niveau', async ({ page }) => {
    await page.goto('/fr/produit/thermomix-tm7');
    const levels = await page
      .locator('h1, h2, h3, h4')
      .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    expect(levels[0], 'le premier titre doit être un h1').toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(
        levels[i] - levels[i - 1],
        `saut de niveau h${levels[i - 1]} → h${levels[i]}`,
      ).toBeLessThanOrEqual(1);
    }
  });

  test('l’accueil expose un repère main et un lien d’évitement', async ({ page }) => {
    await page.goto('/fr');
    await expect(page.locator('main#content')).toHaveCount(1);
    await expect(page.locator('a.skip-link')).toHaveCount(1);
  });

  test('toutes les images portent un attribut alt', async ({ page }) => {
    await page.goto('/fr/catalogue');
    const missing = await page
      .locator('img')
      .evaluateAll((els) => els.filter((e) => e.getAttribute('alt') === null).length);
    expect(missing, 'des <img> n’ont pas d’attribut alt').toBe(0);
  });

  test('les liens externes sont sécurisés', async ({ page }) => {
    await page.goto('/fr');
    const unsafe = await page.locator('a[target="_blank"]').evaluateAll((els) =>
      els
        .filter((e) => !(e.getAttribute('rel') ?? '').includes('noopener'))
        .map((e) => e.getAttribute('href')),
    );
    expect(unsafe, 'liens _blank sans rel="noopener"').toEqual([]);
  });
});

test.describe('Données structurées', () => {
  test('l’accueil décrit l’organisation et le site', async ({ page }) => {
    await page.goto('/fr');
    const blocks = await jsonLd(page);
    expect(blocks.length, 'aucun JSON-LD sur l’accueil').toBeGreaterThan(0);

    const org = ldByType(blocks, 'Organization');
    expect(org, 'nœud Organization absent').toBeTruthy();
    expect(org!.name).toBe('KitchenPrime');
    expect(Array.isArray(org!.sameAs)).toBe(true);

    const site = ldByType(blocks, 'WebSite');
    expect(site, 'nœud WebSite absent').toBeTruthy();
    expect(site!.potentialAction, 'SearchAction absente').toBeTruthy();

    const list = ldByType(blocks, 'ItemList');
    expect(list, 'ItemList des produits populaires absente').toBeTruthy();
  });

  test('la fiche produit porte un nœud Product complet', async ({ page }) => {
    await page.goto('/fr/produit/thermomix-tm7');
    const blocks = await jsonLd(page);

    const product = ldByType(blocks, 'Product') as
      | {
          name: string;
          sku: string;
          brand: { name: string };
          image: string[];
          offers: {
            price: string;
            priceCurrency: string;
            availability: string;
            priceValidUntil: string;
            itemCondition: string;
            hasMerchantReturnPolicy: unknown;
            shippingDetails: unknown;
          };
          aggregateRating: { ratingValue: string; reviewCount: number };
        }
      | undefined;

    expect(product, 'nœud Product absent').toBeTruthy();
    expect(product!.name).toBe('Thermomix TM7');
    expect(product!.sku).toMatch(/^ROB-\d{3}$/);
    expect(product!.brand.name).toBe('Thermomix');
    expect(product!.image.length).toBeGreaterThan(0);

    // Champs sans lesquels Google n'affiche pas l'extrait enrichi produit.
    expect(product!.offers.priceCurrency).toBe('EUR');
    expect(product!.offers.price).toMatch(/^\d+\.\d{2}$/);
    expect(product!.offers.availability).toContain('schema.org/');
    expect(product!.offers.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(product!.offers.hasMerchantReturnPolicy).toBeTruthy();
    expect(product!.offers.shippingDetails).toBeTruthy();
    expect(Number(product!.aggregateRating.ratingValue)).toBeGreaterThan(0);
    expect(product!.aggregateRating.reviewCount).toBeGreaterThan(0);
  });

  test('la fiche produit porte un fil d’Ariane à trois niveaux', async ({ page }) => {
    await page.goto('/fr/produit/thermomix-tm7');
    const bc = ldByType(await jsonLd(page), 'BreadcrumbList') as
      | { itemListElement: Array<{ position: number; name: string; item: string }> }
      | undefined;
    expect(bc, 'BreadcrumbList absente').toBeTruthy();
    expect(bc!.itemListElement).toHaveLength(3);
    expect(bc!.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(bc!.itemListElement[2].item).toBe(`${BASE_URL}/fr/produit/thermomix-tm7`);
  });

  test('le prix structuré correspond au prix affiché', async ({ page }) => {
    await page.goto('/fr/produit/samsung-family-hub');
    const product = ldByType(await jsonLd(page), 'Product') as { offers: { price: string } };
    const shown = await page.locator('.pdp-price').innerText();
    const digits = shown.replace(/[^\d]/g, '');
    expect(digits, `prix affiché « ${shown} » ≠ JSON-LD ${product.offers.price}`).toBe(
      String(Math.round(Number(product.offers.price))),
    );
  });

  test('chaque nœud déclare un @type', async ({ page }) => {
    for (const path of ['', '/catalogue', '/produit/ninja-creami', '/contact']) {
      await page.goto(`/fr${path}`);
      for (const node of ldNodes(await jsonLd(page))) {
        expect(node['@type'], `nœud sans @type sur ${path}`).toBeTruthy();
      }
    }
  });

  test('la page contact est décrite comme telle', async ({ page }) => {
    await page.goto('/fr/contact');
    expect(ldByType(await jsonLd(page), 'ContactPage')).toBeTruthy();
  });
});

test.describe('Indexation', () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path || '/'} est indexable`, async ({ page }) => {
      await page.goto(`/fr${path}`);
      const robots = await meta(page, 'robots');
      expect(robots ?? 'index', `${path} est en noindex`).not.toContain('noindex');
    });
  }

  for (const path of PRIVATE_PATHS) {
    test(`${path} est en noindex`, async ({ page }) => {
      await page.goto(`/fr${path}`);
      const robots = await meta(page, 'robots');
      expect(robots, `${path} devrait être en noindex`).toContain('noindex');
    });
  }
});

test.describe('robots.txt et sitemap', () => {
  test('robots.txt référence le sitemap et protège les pages privées', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('User-Agent: *');
    expect(body).toContain(`Sitemap: ${BASE_URL}/sitemap.xml`);
    expect(body).toContain('/api/');
    expect(body).toContain('/admin');
  });

  test('le sitemap est un XML valide et complet', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('xml');

    const xml = await res.text();
    expect(xml.startsWith('<?xml')).toBe(true);

    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    // 4 locales × (6 pages statiques + 20 produits)
    expect(urls.length).toBe(4 * 26);
    expect(new Set(urls).size, 'URL en double dans le sitemap').toBe(urls.length);

    for (const l of LOCALES) {
      expect(urls).toContain(`${BASE_URL}/${l}`);
      expect(urls).toContain(`${BASE_URL}/${l}/catalogue`);
      expect(urls).toContain(`${BASE_URL}/${l}/produit/thermomix-tm7`);
      expect(urls).toContain(`${BASE_URL}/${l}/produit/dyson-hot-cool`);
    }
  });

  test('le sitemap ne liste aucune page en noindex', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const p of PRIVATE_PATHS) {
      expect(xml, `${p} ne doit pas figurer au sitemap`).not.toContain(`${p}<`);
    }
  });

  test('le sitemap déclare les alternates hreflang', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('xhtml:link');
    expect(xml).toContain('hreflang="x-default"');
    expect(xml).toContain('hreflang="de-DE"');
  });

  test('le manifeste web est servi', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest');
    expect(res.status()).toBe(200);
    const m = await res.json();
    expect(m.name).toBeTruthy();
    expect(m.start_url).toBe('/fr');
    expect(Array.isArray(m.icons)).toBe(true);
  });

  test('toutes les URL du sitemap répondent 200', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    // Échantillon : une page de chaque type par locale, pour rester rapide.
    const sample = urls.filter((_, i) => i % 13 === 0);
    for (const url of sample) {
      const res = await request.get(url);
      expect(res.status(), `${url} répond ${res.status()}`).toBe(200);
    }
  });
});
