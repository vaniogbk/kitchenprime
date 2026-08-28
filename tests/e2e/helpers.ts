import { expect, type Page } from '@playwright/test';

/** GIF transparent de 1×1 px, servi à la place des visuels distants. */
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

/**
 * Neutralise les visuels distants.
 *
 * Les tests de balisage et de parcours n'ont pas besoin des photos : sans ce
 * garde-fou, chaque navigation attend qu'Unsplash réponde puis que
 * l'optimiseur d'images de Next ré-encode chaque fichier, ce qui fait expirer
 * les tests sans rien révéler d'utile. Les tests de performance, eux, ne
 * l'utilisent pas : ils mesurent le chargement réel.
 */
export async function stubImages(page: Page) {
  await page.route('**/_next/image**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/gif', body: PIXEL }),
  );
  await page.route('https://images.unsplash.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/gif', body: PIXEL }),
  );
}

export const LOCALES = ['fr', 'de', 'it', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const BCP47: Record<Locale, string> = {
  fr: 'fr-FR', de: 'de-DE', it: 'it-IT', en: 'en-GB',
};

/** Chemins publics indexables, sans préfixe de locale. */
export const PUBLIC_PATHS = [
  '',
  '/catalogue',
  '/produit/thermomix-tm7',
  '/produit/samsung-family-hub',
  '/contact',
  '/cgv',
  '/mentions-legales',
  '/politique-retour',
] as const;

/** Chemins qui ne doivent jamais être indexés. */
export const PRIVATE_PATHS = ['/checkout', '/panier', '/favoris'] as const;

export async function attr(page: Page, selector: string, name: string): Promise<string | null> {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  return el.getAttribute(name);
}

/** Contenu d'une balise meta (`name` ou `property`). */
export async function meta(page: Page, key: string): Promise<string | null> {
  return (
    (await attr(page, `meta[name="${key}"]`, 'content')) ??
    (await attr(page, `meta[property="${key}"]`, 'content'))
  );
}

/** Tous les blocs JSON-LD de la page, déjà analysés. */
export async function jsonLd(page: Page): Promise<Array<Record<string, unknown>>> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  return raw.map((r) => {
    try {
      return JSON.parse(r) as Record<string, unknown>;
    } catch (e) {
      throw new Error(`JSON-LD invalide : ${(e as Error).message}\n${r.slice(0, 200)}`);
    }
  });
}

/** Aplatit les `@graph` pour retrouver un nœud par son `@type`. */
export function ldNodes(blocks: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return blocks.flatMap((b) => {
    const graph = b['@graph'];
    return Array.isArray(graph) ? (graph as Array<Record<string, unknown>>) : [b];
  });
}

export function ldByType(
  blocks: Array<Record<string, unknown>>,
  type: string,
): Record<string, unknown> | undefined {
  return ldNodes(blocks).find((n) => n['@type'] === type);
}

/** Vérifie qu'une page a bien un titre unique et non vide. */
export async function expectSingleH1(page: Page) {
  const h1 = page.locator('h1');
  await expect(h1, 'la page doit avoir exactement un <h1>').toHaveCount(1);
  expect((await h1.first().innerText()).trim().length).toBeGreaterThan(0);
}
