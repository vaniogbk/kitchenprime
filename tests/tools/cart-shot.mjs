import { chromium } from '@playwright/test';
const [,, base, out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
// Remplit le panier avant la capture.
await p.goto(`${base}/fr/produit/thermomix-tm7`);
await p.getByRole('button', { name: /ajouter au panier/i }).click();
await p.waitForURL(/panier/);
await p.goto(`${base}/fr/produit/varoma-xl-steam-set`);
await p.getByRole('button', { name: /ajouter au panier/i }).click();
await p.waitForURL(/panier/);
await p.waitForTimeout(1500);
await p.screenshot({ path: out });
await b.close();
console.log('ok', out);
