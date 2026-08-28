/**
 * Commande de build du projet.
 *
 * Le schéma n'est synchronisé **que** pour un déploiement de production.
 *
 * Auparavant, `npm run build` lançait `prisma db push --accept-data-loss`
 * systématiquement. Deux conséquences fâcheuses :
 *
 *  1. Chaque preview de pull request poussait le schéma de sa branche dans la
 *     base de production, avec `--accept-data-loss` : une colonne supprimée
 *     sur une branche d'essai emportait les données correspondantes en
 *     production, sans revue ni confirmation.
 *
 *  2. Tout build devenait dépendant d'une base joignable. Une indisponibilité
 *     de la base faisait échouer la compilation d'un code pourtant valide —
 *     c'est ce qui a mis en échec la preview de la PR #1.
 *
 * `VERCEL_ENV` vaut « production », « preview » ou « development ». Hors
 * Vercel (build local, CI GitHub), la variable est absente et le schéma n'est
 * jamais touché : `npm run db:push` reste disponible pour le faire à la main.
 */
import { spawnSync } from 'node:child_process';

const isProductionDeploy = process.env.VERCEL_ENV === 'production';

function run(label, command, args, { fatal = true } = {}) {
  console.log(`\n▸ ${label}`);
  const res = spawnSync(command, args, { stdio: 'inherit', shell: true, env: process.env });
  if (res.status !== 0 && fatal) process.exit(res.status ?? 1);
  return res.status === 0;
}

if (isProductionDeploy) {
  /*
   * L'échec de la synchronisation n'interrompt pas le build.
   *
   * Aucune page publique ne lit la base : le catalogue, les fiches produit et
   * les pages légales sont rendus depuis `lib/` et `content/`. Seuls les
   * routes /api et l'espace /admin en dépendent, et ils sont de toute façon
   * hors service quand la base est injoignable.
   *
   * Bloquer le build dans ce cas revient donc à laisser l'ancienne version en
   * ligne — sans rien réparer — au lieu de publier une vitrine qui fonctionne.
   */
  const ok = run(
    'Synchronisation du schéma (déploiement de production)',
    'npx',
    ['prisma', 'db', 'push', '--skip-generate', '--accept-data-loss'],
    { fatal: false },
  );
  if (!ok) {
    console.warn(
      [
        '',
        '⚠  SCHÉMA NON SYNCHRONISÉ — la base est injoignable.',
        '   La vitrine est publiée normalement (elle ne lit pas la base),',
        '   mais les commandes, les webhooks de paiement et l’espace admin',
        '   resteront hors service tant que la base ne répond pas.',
        '   Une fois la base rétablie : npm run db:push',
        '',
      ].join('\n'),
    );
  }
} else {
  console.log(
    `\n▸ Schéma non synchronisé (VERCEL_ENV=${process.env.VERCEL_ENV ?? 'absent'}).` +
      '\n  Seul un déploiement de production met la base à jour ; utilisez' +
      '\n  `npm run db:push` pour le faire manuellement.',
  );
}

run('Génération du client Prisma', 'npx', ['prisma', 'generate']);
run('Build Next.js', 'npx', ['next', 'build']);
