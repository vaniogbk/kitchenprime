import { test, expect } from '@playwright/test';

/**
 * Garde-fous de performance mesurés dans un vrai navigateur.
 *
 * Ils ne remplacent pas Lighthouse (voir `npm run test:lighthouse`) : ils
 * verrouillent les décisions structurelles — pas de CSS tiers bloquant, pas de
 * webfont d'icônes, budget de poids — pour qu'une régression soit visible
 * immédiatement plutôt qu'au prochain audit.
 */

const PAGES = ['/fr', '/fr/catalogue', '/fr/produit/thermomix-tm7'];

// Ces tests chargent les vrais visuels : l'optimiseur d'images de Next
// ré-encode chaque photo distante au premier appel, ce qui est lent à froid.
test.describe.configure({ timeout: 120_000 });

/** Attend le silence réseau sans faire échouer le test s'il ne vient jamais. */
async function settle(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle', { timeout: 45_000 }).catch(() => {});
}

test.describe('Requêtes réseau', () => {
  for (const path of PAGES) {
    test(`${path} ne charge aucune ressource tierce bloquante`, async ({ page }) => {
      const thirdParty: string[] = [];
      page.on('request', (r) => {
        const url = r.url();
        if (url.startsWith('http') && !url.includes('localhost')) {
          // Les visuels Unsplash sont attendus ; le reste ne l'est pas.
          if (!url.includes('images.unsplash.com')) thirdParty.push(url);
        }
      });

      await page.goto(path, { waitUntil: 'load' });
      await settle(page);
      expect(thirdParty, `ressources tierces inattendues : ${thirdParty.join(', ')}`).toEqual([]);
    });
  }

  test('Font Awesome n’est plus chargé depuis un CDN', async ({ page }) => {
    // L'ancienne feuille cdnjs bloquait le rendu et pesait ~200 Ko de webfonts.
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto('/fr', { waitUntil: 'load' });
    await settle(page);

    expect(requests.filter((u) => u.includes('cdnjs') || u.includes('fontawesome'))).toEqual([]);
    await expect(page.locator('link[href*="font-awesome"]')).toHaveCount(0);
  });

  test('les icônes sont bien rendues en SVG inline', async ({ page }) => {
    await page.goto('/fr');
    const svgCount = await page.locator('i.ico > svg').count();
    expect(svgCount, 'aucune icône SVG rendue').toBeGreaterThan(5);
  });

  test('la connexion au CDN d’images est préétablie', async ({ page }) => {
    await page.goto('/fr');
    await expect(
      page.locator('link[rel="preconnect"][href*="images.unsplash.com"]'),
    ).toHaveCount(1);
  });
});

test.describe('Images', () => {
  test('les visuels sont servis par l’optimiseur Next au format moderne', async ({ page }) => {
    await page.goto('/fr/catalogue', { waitUntil: 'load' });
    await settle(page);
    const srcs = await page.locator('img').evaluateAll((els) =>
      els.map((e) => e.getAttribute('src') ?? ''),
    );
    const optimized = srcs.filter((s) => s.startsWith('/_next/image'));
    expect(optimized.length, 'aucune image ne passe par /_next/image').toBeGreaterThan(0);
  });

  test('chaque image déclare ses dimensions ou un ratio (anti-CLS)', async ({ page }) => {
    await page.goto('/fr/catalogue');
    const bad = await page.locator('img').evaluateAll((els) =>
      els
        .filter((e) => {
          const img = e as HTMLImageElement;
          const style = getComputedStyle(img);
          // Le mode `fill` de next/image positionne l'image en absolu dans un
          // conteneur au ratio fixé : la hauteur est donc déjà réservée.
          const filled = style.position === 'absolute';
          return !filled && !(img.getAttribute('width') && img.getAttribute('height'));
        })
        .map((e) => (e as HTMLImageElement).src),
    );
    expect(bad, `images sans dimensions réservées : ${bad.join(', ')}`).toEqual([]);
  });

  test('les visuels hors écran sont différés', async ({ page }) => {
    await page.goto('/fr/catalogue');
    const eager = await page
      .locator('img')
      .evaluateAll((els) => els.filter((e) => e.getAttribute('loading') !== 'lazy').length);
    // Seules les premières cartes doivent être chargées sans délai.
    expect(eager, 'trop d’images chargées en priorité').toBeLessThanOrEqual(4);
  });
});

test.describe('Budget de poids', () => {
  test('l’accueil tient dans son budget de transfert', async ({ page }) => {
    // On compte les octets réellement transférés (donc compressés), pas la
    // taille décompressée : c'est ce que paie le visiteur sur son forfait.
    const byType = { js: 0, css: 0, html: 0, other: 0 };

    page.on('response', async (res) => {
      const type = res.headers()['content-type'] ?? '';
      if (!/javascript|css|html|json/.test(type)) return;
      let size = 0;
      try {
        size = (await res.request().sizes()).responseBodySize;
      } catch {
        return; /* requête avortée ou redirigée */
      }
      if (/javascript|json/.test(type)) byType.js += size;
      else if (/css/.test(type)) byType.css += size;
      else if (/html/.test(type)) byType.html += size;
      else byType.other += size;
    });

    await page.goto('/fr', { waitUntil: 'load' });
    await settle(page);

    const kb = (n: number) => Math.round(n / 1024);
    const total = kb(byType.js + byType.css + byType.html + byType.other);
    const detail = `JS ${kb(byType.js)} Ko · CSS ${kb(byType.css)} Ko · HTML ${kb(byType.html)} Ko`;

    expect(kb(byType.css), `CSS = ${kb(byType.css)} Ko`).toBeLessThan(20);
    expect(total, `transfert total = ${total} Ko (${detail})`).toBeLessThan(250);
  });
});

test.describe('Mise en page des vignettes', () => {
  test('le cœur des favoris reste dans le coin haut-droit, sans chevaucher le badge', async ({ page }) => {
    // Une règle du lien étendu avait remplacé son `position: absolute` par
    // `relative` : le bouton retombait en haut à gauche, sur le badge.
    await page.goto('/fr/catalogue');
    const card = page.locator('article.pcard').first();
    const img = await card.locator('.pcard-img').boundingBox();
    const wish = await card.locator('.pwish').boundingBox();
    const badge = await card.locator('.pbadge').boundingBox();

    expect(img && wish, 'vignette ou bouton favori introuvable').toBeTruthy();
    // Le bouton doit se trouver dans la moitié droite du visuel.
    expect(wish!.x).toBeGreaterThan(img!.x + img!.width / 2);
    expect(wish!.y).toBeLessThan(img!.y + 60);

    if (badge) {
      const overlap =
        wish!.x < badge.x + badge.width &&
        wish!.x + wish!.width > badge.x &&
        wish!.y < badge.y + badge.height &&
        wish!.y + wish!.height > badge.y;
      expect(overlap, 'le bouton favori chevauche le badge').toBe(false);
    }
  });
});

test.describe('Rendu et animation', () => {
  test('le contenu principal est présent dans le HTML servi', async ({ request }) => {
    // Contrôle du rendu serveur : un moteur qui n'exécute pas JS doit tout voir.
    const html = await (await request.get('/fr/produit/thermomix-tm7')).text();
    expect(html).toContain('Thermomix TM7');
    expect(html).toContain('application/ld+json');
    expect(html.toLowerCase()).toContain('<h1');
  });

  test('l’accueil 3D n’ajoute aucune bibliothèque externe', async ({ page }) => {
    await page.goto('/fr');
    // L'effet repose sur des transformations CSS, pas sur WebGL.
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('.hero-scene')).toHaveCount(1);
    const transform = await page
      .locator('.hero-stage')
      .evaluate((el) => getComputedStyle(el).transformStyle);
    expect(transform).toBe('preserve-3d');
  });

  test('l’animation respecte prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/fr');
    const anim = await page
      .locator('.hero-stage')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(anim, 'l’animation devrait être désactivée').toBe('none');
  });
});
