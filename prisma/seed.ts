import { PrismaClient, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PRODUCTS } from '../lib/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KitchenPrime database...');

  /*
   * Compte administrateur.
   *
   * Deux garde-fous, après deux constats sur la base de production :
   *
   *  1. Sans `ADMIN_PASSWORD`, le seed créait un compte avec un mot de passe
   *     écrit en clair dans ce fichier — donc public, puisque le dépôt l'est.
   *     Refuser plutôt que de créer un accès administrateur devinable.
   *
   *  2. `update: {}` signifiait qu'aucun `ADMIN_PASSWORD` ne pouvait plus
   *     jamais changer le mot de passe d'un compte existant : le seul moyen de
   *     le renouveler était d'aller modifier la base à la main. Le mot de passe
   *     est désormais mis à jour quand la variable est explicitement fournie.
   */
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kitchenprime.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existing && !adminPassword) {
    throw new Error(
      `Aucun compte admin « ${adminEmail} » et ADMIN_PASSWORD non défini.\n` +
        'Définissez ADMIN_PASSWORD avant de lancer le seed : créer un compte\n' +
        'avec un mot de passe par défaut ouvrirait /admin à quiconque lit ce dépôt.',
    );
  }

  if (adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash, name: 'KitchenPrime Admin' },
    });
    console.log(`✓ Compte admin ${existing ? 'mis à jour' : 'créé'} : ${adminEmail}`);
  } else {
    console.log(`✓ Compte admin inchangé : ${adminEmail} (ADMIN_PASSWORD non fourni)`);
  }

  // Products
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        brand: p.brand,
        category: p.category as Category,
        priceCents: p.priceCents,
        oldPriceCents: p.oldPriceCents,
        imageId: p.imageId,
        badge: p.badge || null,
        badgeKey: p.badgeKey || null,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
      },
      create: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        category: p.category as Category,
        ref: p.ref,
        priceCents: p.priceCents,
        oldPriceCents: p.oldPriceCents,
        imageId: p.imageId,
        badge: p.badge || null,
        badgeKey: p.badgeKey || null,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
      },
    });
  }

  console.log(`✓ Seeded ${PRODUCTS.length} products`);

  /*
   * Désactive les produits retirés du catalogue.
   *
   * Le seed procède par `upsert` : il crée et met à jour, mais n'a jamais rien
   * retiré. Des articles supprimés de `lib/products.ts` restaient donc actifs
   * en base et continuaient d'être servis par `/api/products`, alors qu'ils
   * n'ont plus ni page ni contenu.
   *
   * On désactive plutôt que de supprimer : une commande passée peut référencer
   * le produit, et `active: false` suffit à le retirer de la vitrine.
   */
  const slugs = PRODUCTS.map((p) => p.slug);
  const { count } = await prisma.product.updateMany({
    where: { slug: { notIn: slugs }, active: true },
    data: { active: false },
  });
  if (count > 0) {
    const stale = await prisma.product.findMany({
      where: { slug: { notIn: slugs } },
      select: { slug: true },
    });
    console.log(`✓ Désactivé ${count} produit(s) hors catalogue : ${stale.map((s) => s.slug).join(', ')}`);
  }

  console.log('✅ Done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
