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
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 45_000,
  expect: { timeout: 7_000 },

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
