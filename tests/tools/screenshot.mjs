import { chromium } from '@playwright/test';
const out = process.argv[3];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(process.argv[2], { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('ok', out);
