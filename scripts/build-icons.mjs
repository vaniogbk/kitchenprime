/**
 * Génère `components/ui/icons.generated.ts` à partir des SVG de
 * @fortawesome/fontawesome-free (devDependency) en n'embarquant QUE les
 * icônes réellement référencées dans le code source.
 *
 * Objectif perf : supprimer le <link> CDN Font Awesome (CSS bloquant +
 * ~200 Ko de webfonts) au profit de ~10 Ko de path SVG inline.
 *
 * Usage : node scripts/build-icons.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const FA = 'node_modules/@fortawesome/fontawesome-free/svgs';
const SRC_DIRS = ['app', 'components', 'lib'];
const OUT = 'components/ui/icons.generated.ts';

/** Icônes Pro (absentes du set free) → équivalent free le plus proche. */
const ALIASES = { 'grid-2': 'table-cells-large' };

/** Icônes voulues dans le style `regular` : clé exposée → fichier source. */
const REGULAR = { 'heart-regular': 'heart' };

/** Toujours embarquées même si non détectées statiquement (usages dynamiques). */
const ALWAYS = ['border-all', 'table-cells-large', 'circle-xmark', 'spinner', 'xmark', 'a', 'm', 's', 'stripe', 'cart-shopping', 'heart'];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (['.ts', '.tsx'].includes(extname(p))) out.push(p);
  }
  return out;
}

const files = SRC_DIRS.filter(existsSync).flatMap(walk).filter((f) => !f.endsWith('icons.generated.ts'));
/** Noms certains : leur absence est une erreur. */
const found = new Set(ALWAYS);
/**
 * Noms devinés par heuristique. Un littéral trouvé près d'un attribut `icon`
 * ou `name` n'est pas forcément une icône : dans
 * `name={m === 'card' ? 'credit-card' : 'building-columns'}`, la condition
 * livre aussi « card ». On les ignore donc s'ils ne correspondent à aucun
 * fichier, au lieu de faire échouer la génération.
 */
const guessed = new Set();
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\bfa-([a-z0-9-]+)/g)) {
    const n = m[1];
    if (['solid', 'regular', 'brands'].includes(n)) continue;
    found.add(ALIASES[n] ?? n);
  }
  /*
   * Trois formes cohabitent dans le code, et il faut les couvrir toutes :
   *   <Icon name="star" />
   *   <Icon name={added ? 'check' : 'cart-plus'} />
   *   <LegalArticle icon="file-contract" />   /   { icon: 'blender' }
   *
   * On isole le fragment qui suit l'attribut, puis on en extrait tous les
   * littéraux : une ternaire livre ainsi ses deux branches. La détection est
   * volontairement restreinte à `name=` précédé de `<Icon`, et à `icon`, pour
   * ne pas confondre avec l'attribut `name` d'un champ de formulaire.
   *
   * Si une icône échappait malgré tout au scanner, `tsc` le signalerait :
   * `IconName` est dérivé de ce fichier, donc toute icône absente casse la
   * compilation à l'endroit exact où elle est utilisée.
   */
  const chunks = [
    ...[...src.matchAll(/<Icon\b[\s\S]{0,300}?\bname\s*=\s*(\{[^}]*\}|["'][^"']*["'])/g)].map((m) => m[1]),
    ...[...src.matchAll(/\bicon\s*[:=]\s*(\{[^}]*\}|["'][^"']*["'])/g)].map((m) => m[1]),
  ];
  for (const chunk of chunks) {
    for (const lit of chunk.matchAll(/["']([a-z][a-z0-9-]*)["']/g)) guessed.add(lit[1]);
  }
}

/** Résout un nom vers {dir, file}, en testant solid → brands → regular. */
function resolve(name) {
  for (const dir of ['solid', 'brands', 'regular']) {
    const p = join(FA, dir, `${name}.svg`);
    if (existsSync(p)) return p;
  }
  return null;
}

function parse(p) {
  const svg = readFileSync(p, 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  // Certaines icônes ont plusieurs <path> : on les concatène.
  const d = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]).join(' ');
  if (!viewBox || !d) throw new Error(`SVG illisible : ${p}`);
  return { viewBox, d };
}

const entries = [];
const missing = [];

for (const name of [...found].sort()) {
  if (name in REGULAR) continue;
  const p = resolve(name);
  if (!p) { missing.push(name); continue; }
  entries.push([name, parse(p)]);
}

for (const name of [...guessed].sort()) {
  if (name in REGULAR || found.has(name)) continue;
  const p = resolve(name);
  if (p) entries.push([name, parse(p)]);
}
for (const [key, src] of Object.entries(REGULAR)) {
  const p = join(FA, 'regular', `${src}.svg`);
  if (!existsSync(p)) { missing.push(key); continue; }
  entries.push([key, parse(p)]);
}

if (missing.length) {
  console.error(`✖ Icônes introuvables dans le set free : ${missing.join(', ')}`);
  process.exit(1);
}

entries.sort((a, b) => a[0].localeCompare(b[0]));

const body = entries
  .map(([n, { viewBox, d }]) => `  ${JSON.stringify(n)}: ['${viewBox}', '${d}'],`)
  .join('\n');

writeFileSync(
  OUT,
  `// GÉNÉRÉ PAR scripts/build-icons.mjs — NE PAS ÉDITER À LA MAIN.
// Source : @fortawesome/fontawesome-free (Icons CC BY 4.0, Code MIT).
// Régénérer : npm run build:icons

export type IconName =
${entries.map(([n]) => `  | ${JSON.stringify(n)}`).join('\n')};

/** [viewBox, path] par icône. */
export const ICONS: Record<IconName, readonly [string, string]> = {
${body}
};
`,
  'utf8',
);

const kb = (Buffer.byteLength(readFileSync(OUT)) / 1024).toFixed(1);
console.log(`✔ ${entries.length} icônes → ${OUT} (${kb} Ko)`);
