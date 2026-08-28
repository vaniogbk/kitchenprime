/**
 * Vérifie que chaque visuel distant référencé par le site existe encore.
 *
 * Une photo retirée d'Unsplash devient un 404 : l'optimiseur d'images de Next
 * échoue et la carte produit s'affiche vide, sans que rien ne le signale.
 *
 * Volontairement hors de la suite de tests : le résultat dépend d'un service
 * tiers et ne doit pas faire échouer une CI pour une raison sans rapport avec
 * le code. À lancer avant une mise en production.
 *
 * Usage : node scripts/check-images.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const CONCURRENCY = 6;

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (['.ts', '.tsx'].includes(extname(p))) out.push(p);
  }
  return out;
}

// Tous les identifiants de photo cités dans le code source.
const ids = new Map(); // id → fichiers qui le citent
for (const file of ['lib', 'components', 'app'].flatMap(walk)) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/'(photo-[a-z0-9-]+)'/g)) {
    if (!ids.has(m[1])) ids.set(m[1], new Set());
    ids.get(m[1]).add(file);
  }
}

const entries = [...ids.entries()];
console.log(`Vérification de ${entries.length} visuels…\n`);

const broken = [];
for (let i = 0; i < entries.length; i += CONCURRENCY) {
  const batch = entries.slice(i, i + CONCURRENCY);
  await Promise.all(
    batch.map(async ([id, files]) => {
      // Mêmes paramètres que RemoteImage : c'est cette URL exacte que
      // l'optimiseur va chercher.
      const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) broken.push({ id, status: res.status, files: [...files] });
      } catch (err) {
        broken.push({ id, status: String(err), files: [...files] });
      }
    }),
  );
}

if (broken.length === 0) {
  console.log(`✔ Les ${entries.length} visuels répondent.`);
  process.exit(0);
}

console.error(`✖ ${broken.length} visuel(s) introuvable(s) :\n`);
for (const b of broken) {
  console.error(`  ${b.id}  → ${b.status}`);
  for (const f of b.files) console.error(`      ${f}`);
}
process.exit(1);
