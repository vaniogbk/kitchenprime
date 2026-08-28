import { chromium, type FullConfig } from '@playwright/test';

/**
 * Préchauffe le cache d'images avant la suite.
 *
 * `perf.spec.ts` charge les vrais visuels Unsplash. Au premier appel,
 * l'optimiseur de Next va chercher chaque photo distante puis la ré-encode —
 * une opération lourde qui monopolise le serveur de test. Les autres fichiers
 * de test, qui partagent ce serveur, se retrouvaient alors à dépasser leurs
 * délais : deux d'entre eux échouaient en suite complète alors qu'ils
 * passaient isolément.
 *
 * Une visite préalable remplit `.next/cache/images`, si bien que les tests
 * mesurent ensuite un service d'images chaud — ce qui reflète d'ailleurs mieux
 * la production, où le CDN sert des images déjà optimisées.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) return;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pages = ['/fr', '/fr/catalogue', '/fr/produit/thermomix-tm7'];
  for (const path of pages) {
    try {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'load', timeout: 60_000 });
      await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => {});
    } catch {
      // Le préchauffage est une optimisation : son échec ne doit pas
      // empêcher la suite de s'exécuter.
    }
  }

  await browser.close();
}
