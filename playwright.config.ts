import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3178);
export const BASE_URL = `http://localhost:${PORT}`;

/**
 * Les tests tournent sur la sortie de production (`next start`), pas sur le
 * serveur de développement : seul le build de production reflète le rendu
 * statique, les métadonnées finales et le poids réel des bundles.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Une tentative de reprise partout, pas seulement en CI. Les tests qui
  // cliquent puis attendent une navigation dépendent du temps de réponse d'un
  // serveur Next unique, partagé par tous les workers : sous charge, la
  // navigation dépasse le délai alors que le code est correct. Chacun de ces
  // tests passe isolément ; c'est l'environnement qui flanche, pas le site.
  retries: 1,
  // Plafonné en local : par défaut Playwright prend la moitié des cœurs, ce
  // qui met le serveur de test à genoux et fait échouer des tests sains.
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  // Remplit le cache d'images avant la suite : sans cela, l'optimiseur de Next
  // ré-encode les visuels distants pendant les tests et sature le serveur
  // partagé, faisant expirer des tests sans rapport.
  globalSetup: './tests/e2e/global-setup.ts',
  timeout: 45_000,
  // 15 s plutôt que 7 : une navigation client sur un serveur partagé et
  // chargé prend plus que le défaut, sans que cela révèle quoi que ce soit.
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Les contrôles responsive n'ont de sens qu'en viewport mobile.
      testIgnore: /responsive\.spec\.ts/,
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /(responsive|seo)\.spec\.ts/ },
  ],

  webServer: {
    command: `npx next start -p ${PORT}`,
    url: BASE_URL,
    // Toujours démarrer un serveur neuf : réutiliser un processus laissé
    // ouvert sert un build périmé, et les échecs qui en découlent ressemblent
    // à de vraies régressions.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      // Les canoniques et hreflang doivent viser le serveur de test, sinon
      // toutes les assertions d'URL absolue échouent.
      NEXT_PUBLIC_APP_URL: BASE_URL,
    },
  },
});
