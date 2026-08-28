import { PrismaClient, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PRODUCTS } from '../lib/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KitchenPrime database...');

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kitchenprime.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe!Now2026';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      name: 'KitchenPrime Admin',
    },
  });
  console.log(`✓ Admin user ready: ${adminEmail}`);

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
