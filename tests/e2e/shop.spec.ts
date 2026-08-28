import { test, expect } from '@playwright/test';
import { LOCALES, stubImages } from './helpers';

test.beforeEach(async ({ page }) => stubImages(page));

test.describe('Navigation', () => {
  test('la racine redirige vers une locale préfixée', async ({ page }) => {
    // next-intl négocie la langue depuis Accept-Language : le navigateur de
    // test annonce l'anglais, la redirection vers /en est donc correcte.
    await page.goto('/');
    await expect(page).toHaveURL(/\/(fr|de|it|en)$/);
  });

  test('la racine respecte la langue annoncée par le navigateur', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'fr-FR' });
    const p = await ctx.newPage();
    await stubImages(p);
    await p.goto('/');
    await expect(p).toHaveURL(/\/fr$/);
    await ctx.close();
  });

  test('une langue non desservie retombe sur la locale par défaut', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'ja-JP' });
    const p = await ctx.newPage();
    await stubImages(p);
    await p.goto('/');
    await expect(p).toHaveURL(/\/fr$/);
    await ctx.close();
  });

  test('le menu mène au catalogue', async ({ page }) => {
    await page.goto('/fr');
    await page.getByRole('link', { name: /catalogue/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/catalogue/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('le sélecteur de langue conserve le chemin courant', async ({ page }) => {
    await page.goto('/fr/catalogue');
    await page.getByRole('button', { name: 'Deutsch' }).click();
    await expect(page).toHaveURL(/\/de\/catalogue/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  });

  test('le sélecteur de langue est utilisable au clavier', async ({ page }) => {
    // L'ancien sélecteur était un <span> : inatteignable au clavier.
    await page.goto('/fr');
    const btn = page.getByRole('button', { name: 'Italiano' });
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/it$/);
  });

  test('une fiche produit inconnue renvoie 404', async ({ page }) => {
    const res = await page.goto('/fr/produit/produit-inexistant');
    expect(res?.status()).toBe(404);
  });
});

test.describe('Catalogue', () => {
  test('affiche les 20 produits', async ({ page }) => {
    await page.goto('/fr/catalogue');
    await expect(page.locator('article.pcard')).toHaveCount(20);
  });

  test('le filtre par catégorie restreint la grille', async ({ page }) => {
    await page.goto('/fr/catalogue');
    // Les filtres sont des liens : chaque catégorie est une adresse réelle,
    // explorable par les moteurs, et la grille reste rendue côté serveur.
    await page.locator('.cat-bar').getByRole('link', { name: /^Maison/ }).click();
    await expect(page).toHaveURL(/\/fr\/catalogue\?cat=maison/);
    await expect(page.locator('article.pcard')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'Samsung Family Hub' })).toBeVisible();
  });

  test('le filtre conserve la recherche en cours', async ({ page }) => {
    await page.goto('/fr/catalogue?q=tm7');
    await page.locator('.cat-bar').getByRole('link', { name: /^Packs/ }).click();
    await expect(page).toHaveURL(/cat=packs/);
    await expect(page).toHaveURL(/q=tm7/);
  });

  test('la catégorie active est signalée aux lecteurs d’écran', async ({ page }) => {
    await page.goto('/fr/catalogue?cat=livres');
    await expect(page.locator('.cat-chip[aria-current="page"]')).toHaveText(/Livres/);
  });

  test('le paramètre cat= présélectionne le filtre', async ({ page }) => {
    await page.goto('/fr/catalogue?cat=livres');
    await expect(page.locator('article.pcard')).toHaveCount(3);
  });

  test('la recherche filtre sur le nom du produit', async ({ page }) => {
    await page.goto('/fr/catalogue?q=dyson');
    await expect(page.locator('article.pcard')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Dyson Hot+Cool' })).toBeVisible();
  });

  test('une recherche sans résultat affiche un message', async ({ page }) => {
    await page.goto('/fr/catalogue?q=zzzzzz');
    await expect(page.locator('article.pcard')).toHaveCount(0);
    await expect(page.locator('.cart-empty p')).toContainText(/aucun produit/i);
  });

  test('la barre de recherche du menu mène au catalogue filtré', async ({ page }) => {
    await page.goto('/fr');
    await page.getByRole('searchbox').fill('nest');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/fr\/catalogue\?q=nest/);
    await expect(page.locator('article.pcard')).toHaveCount(1);
  });
});

test.describe('Fiche produit', () => {
  test('affiche nom, prix, description et points clés', async ({ page }) => {
    await page.goto('/fr/produit/ninja-creami');
    await expect(page.locator('h1')).toHaveText('Ninja Creami');
    await expect(page.locator('.pdp-price')).toContainText('399');
    await expect(page.locator('.pdp-old')).toContainText('649');
    await expect(page.locator('.pdp-saving')).toContainText('250');
    await expect(page.locator('.pdp-desc p').first()).not.toBeEmpty();
    await expect(page.locator('.pdp-desc li')).toHaveCount(4);
  });

  test('traduit le contenu selon la locale', async ({ page }) => {
    await page.goto('/de/produit/thermostat-nest');
    await expect(page.locator('h1')).toHaveText('Nest Thermostat');
    await page.goto('/it/produit/thermostat-nest');
    await expect(page.locator('h1')).toHaveText('Termostato Nest');
  });

  test('la galerie change de visuel principal', async ({ page }) => {
    await page.goto('/fr/produit/thermomix-tm7');
    const main = page.locator('.pdp-main img');
    const before = await main.getAttribute('src');
    await page.locator('.pdp-thumb').nth(2).click();
    await expect(main).not.toHaveAttribute('src', before ?? '');
  });

  test('propose des produits de la même catégorie', async ({ page }) => {
    await page.goto('/fr/produit/thermomix-tm7');
    const related = page.locator('section:has(#related-title) article.pcard');
    await expect(related).toHaveCount(2);
  });
});

test.describe('Panier', () => {
  test('ajouter depuis le catalogue incrémente le badge', async ({ page }) => {
    await page.goto('/fr/catalogue');
    await expect(page.locator('.cart-count')).toHaveCount(0);
    await page.locator('article.pcard').first().locator('.pbtn-buy').click();
    await expect(page.locator('.cart-count')).toHaveText('1');
  });

  test('le panier survit à un changement de page', async ({ page }) => {
    await page.goto('/fr/catalogue');
    await page.locator('article.pcard').first().locator('.pbtn-buy').click();
    await expect(page.locator('.cart-count')).toHaveText('1');
    await page.goto('/fr/contact');
    await expect(page.locator('.cart-count')).toHaveText('1');
  });

  test('« Ajouter au panier » depuis la fiche redirige vers le panier', async ({ page }) => {
    await page.goto('/fr/produit/thermostat-nest');
    await page.getByRole('button', { name: /ajouter au panier/i }).click();
    await expect(page).toHaveURL(/\/fr\/panier/);
    await expect(page.locator('.cart-line')).toHaveCount(1);
    await expect(page.locator('.cart-total')).toContainText('170');
  });

  test('la quantité recalcule le total', async ({ page }) => {
    await page.goto('/fr/produit/thermostat-nest');
    await page.getByRole('button', { name: /ajouter au panier/i }).click();
    await page.locator('.cart-line input[type="number"]').fill('3');
    await expect(page.locator('.cart-total')).toContainText('510');
  });

  test('retirer un article vide le panier', async ({ page }) => {
    await page.goto('/fr/produit/thermostat-nest');
    await page.getByRole('button', { name: /ajouter au panier/i }).click();
    await page.locator('.cart-remove').click();
    await expect(page.getByText(/panier est vide/i)).toBeVisible();
  });

  test('un panier vide affiche un appel à l’action', async ({ page }) => {
    await page.goto('/fr/panier');
    await expect(page.getByText(/panier est vide/i)).toBeVisible();
    await page.getByRole('link', { name: /catalogue/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/catalogue/);
  });
});

test.describe('Favoris', () => {
  test('le cœur ajoute puis retire un produit', async ({ page }) => {
    await page.goto('/fr/catalogue');
    const heart = page.locator('article.pcard').first().locator('button.pwish');
    await expect(heart).toHaveAttribute('aria-pressed', 'false');
    await heart.click();
    await expect(heart).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/fr/favoris');
    await expect(page.locator('article.pcard')).toHaveCount(1);

    await page.locator('button.pwish').click();
    await expect(page.getByText(/aucun favori/i)).toBeVisible();
  });

  test('une liste vide propose de découvrir le catalogue', async ({ page }) => {
    await page.goto('/fr/favoris');
    await expect(page.getByText(/aucun favori/i)).toBeVisible();
  });
});

test.describe('Tunnel de commande', () => {
  test('le récapitulatif reprend l’article du panier', async ({ page }) => {
    await page.goto('/fr/produit/thermostat-nest');
    await page.getByRole('button', { name: /ajouter au panier/i }).click();
    await page.getByRole('link', { name: /passer commande/i }).click();
    await expect(page).toHaveURL(/\/fr\/checkout/);
    await expect(page.locator('.sum-iname')).toHaveText('Thermostat Nest');
    await expect(page.locator('.sum-total')).toContainText('170');
  });

  test('l’achat direct court-circuite le panier', async ({ page }) => {
    await page.goto('/fr/checkout?p=dyson-hot-cool&qty=2');
    await expect(page.locator('.sum-iname')).toHaveText('Dyson Hot+Cool');
    await expect(page.locator('.sum-total')).toContainText('800');
  });

  test('le formulaire refuse un e-mail invalide', async ({ page }) => {
    await page.goto('/fr/checkout?p=thermostat-nest');
    await page.locator('#ck-name').fill('Jean Test');
    await page.locator('#ck-email').fill('pas-un-email');
    await page.locator('#ck-address').fill('1 rue du Test');
    await page.locator('#ck-city').fill('Nantes');
    await page.locator('#ck-zip').fill('44000');
    await page.locator('button[type="submit"].btn-checkout').click();
    // La validation native bloque l'envoi : on reste sur la page.
    await expect(page).toHaveURL(/\/fr\/checkout/);
    const invalid = await page.locator('#ck-email').evaluate(
      (el) => (el as HTMLInputElement).validity.valid,
    );
    expect(invalid).toBe(false);
  });

  test('un checkout sans panier ni produit invite à revenir au catalogue', async ({ page }) => {
    await page.goto('/fr/checkout');
    await expect(page.getByText(/panier est vide/i)).toBeVisible();
  });
});

test.describe('Traductions de l’interface', () => {
  for (const locale of LOCALES) {
    test(`/${locale} n’affiche pas de clé de traduction brute`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const body = await page.locator('body').innerText();
      // next-intl affiche `namespace.clé` quand un message manque.
      expect(body, 'clé de traduction non résolue').not.toMatch(
        /\b(meta|nav|hero|catalog|pdp|checkout|cart|wishlist|card|badges|footer|topbar|a11y)\.[a-zA-Z]/,
      );
    });
  }
});
