import { test, expect } from '@playwright/test';
import { stubImages } from './helpers';

test.beforeEach(async ({ page }) => stubImages(page));

/**
 * Contrôles de mise en page mobile. Le débordement horizontal est la
 * régression responsive la plus fréquente et la plus pénalisante : Lighthouse
 * la signale, et elle rend la navigation pénible au doigt.
 */
const PATHS = ['/fr', '/fr/catalogue', '/fr/produit/pack-tm7-complet', '/fr/panier', '/fr/cgv'];

test.describe('Mise en page mobile', () => {
  for (const path of PATHS) {
    test(`${path} ne déborde pas horizontalement`, async ({ page }) => {
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      // 1 px de tolérance pour les arrondis de sous-pixel.
      expect(scrollWidth, `${path} déborde de ${scrollWidth - clientWidth} px`).toBeLessThanOrEqual(
        clientWidth + 1,
      );
    });
  }

  test('la scène 3D est aplatie sur mobile', async ({ page }) => {
    await page.goto('/fr');
    const perspective = await page
      .locator('.hero-scene')
      .evaluate((el) => getComputedStyle(el).perspective);
    expect(perspective).toBe('none');
  });

  test('les cibles tactiles principales sont assez grandes', async ({ page }) => {
    await page.goto('/fr/catalogue');
    const small = await page.locator('.cat-chip, .pbtn-buy').evaluateAll((els) =>
      els
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.height < 24)
        .length,
    );
    expect(small, 'des boutons sont trop petits pour le tactile').toBe(0);
  });

  test('la grille produit passe sur une seule colonne', async ({ page }) => {
    await page.goto('/fr/catalogue');
    const cols = await page
      .locator('.grid')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(cols).toBeLessThanOrEqual(2);
  });
});
