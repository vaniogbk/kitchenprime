/**
 * Build de production destiné aux tests end-to-end.
 *
 * Les pages publiques sont pré-rendues : les canoniques, les hreflang et le
 * sitemap sont donc figés au moment du build, à partir de
 * `NEXT_PUBLIC_APP_URL`. Il faut les produire avec l'URL du serveur de test,
 * sinon toutes les assertions d'URL absolue échouent.
 *
 * Wrapper Node plutôt que `VAR=x next build` : cette syntaxe n'existe pas dans
 * cmd.exe, où npm exécute les scripts sous Windows.
 */
import { spawnSync } from 'node:child_process';

const port = process.env.E2E_PORT ?? '3178';
const baseUrl = `http://localhost:${port}`;

const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_PUBLIC_APP_URL: baseUrl,
    NEXTAUTH_URL: baseUrl,
  },
});

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`\n✔ Build prêt pour les tests e2e sur ${baseUrl}`);
