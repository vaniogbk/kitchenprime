/**
 * Génère un mot de passe administrateur solide et l'applique en base.
 *
 * Le mot de passe en clair n'est **jamais** affiché : il est écrit dans un
 * fichier local, ignoré par git. Un secret imprimé dans un terminal finit dans
 * l'historique du shell, dans les journaux de CI et dans les transcriptions
 * d'outils — autant d'endroits qu'on ne pense pas à nettoyer.
 *
 * Usage :
 *   DATABASE_URL='…' node scripts/set-admin-password.mjs
 *   DATABASE_URL='…' node scripts/set-admin-password.mjs --email autre@exemple.fr
 */
import { randomBytes } from 'node:crypto';
import { writeFileSync, chmodSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const OUT = 'admin-password.txt';

/**
 * Mot de passe de 24 caractères tiré d'un alphabet sans ambiguïté visuelle
 * (ni O/0, ni l/1/I), pour rester recopiable à la main sans erreur.
 */
function generate(length = 24) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_';
  const bytes = randomBytes(length * 2);
  let out = '';
  // Rejet des octets hors du plus grand multiple de l'alphabet : sans cela,
  // le modulo favoriserait les premiers caractères.
  const limit = Math.floor(256 / alphabet.length) * alphabet.length;
  for (const b of bytes) {
    if (b >= limit) continue;
    out += alphabet[b % alphabet.length];
    if (out.length === length) break;
  }
  return out.length === length ? out : generate(length);
}

const emailArg = process.argv.indexOf('--email');
const email = (emailArg !== -1 ? process.argv[emailArg + 1] : process.env.ADMIN_EMAIL || 'admin@kitchenprime.com').toLowerCase();

if (!process.env.DATABASE_URL) {
  console.error('✖ DATABASE_URL est requis.');
  process.exit(1);
}

const prisma = new PrismaClient();
const password = generate();
const passwordHash = await bcrypt.hash(password, 12);

const before = await prisma.adminUser.findUnique({ where: { email } });
await prisma.adminUser.upsert({
  where: { email },
  update: { passwordHash },
  create: { email, passwordHash, name: 'KitchenPrime Admin' },
});
await prisma.$disconnect();

writeFileSync(
  OUT,
  [
    '# Mot de passe administrateur KitchenPrime',
    `# Généré le ${new Date().toISOString()}`,
    '#',
    '# Copiez-le dans votre gestionnaire de mots de passe, puis SUPPRIMEZ ce fichier.',
    '',
    `URL       : /admin/login`,
    `Courriel  : ${email}`,
    `Mot de passe : ${password}`,
    '',
  ].join('\n'),
  'utf8',
);
try {
  chmodSync(OUT, 0o600);
} catch {
  /* systèmes de fichiers sans permissions POSIX (Windows) */
}

console.log(`✔ Compte ${before ? 'mis à jour' : 'créé'} : ${email}`);
console.log(`✔ Mot de passe écrit dans ${OUT} — il n'est volontairement pas affiché ici.`);
console.log('  Rangez-le dans votre gestionnaire de mots de passe, puis supprimez le fichier.');
