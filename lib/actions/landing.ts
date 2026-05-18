import { prisma } from '@/lib/prisma';

export async function getLandingData() {
  const [slides, brands, visualCategories] = await Promise.all([
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.brand.findMany({}),
    prisma.featuredCategory.findMany({ include: { category: true }, orderBy: { order: 'asc' } })
  ]);

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, stockStatus: 'instock' },
    take: 10,
    include: { brand: true, category: true },
    orderBy: { updatedAt: 'desc' },
  });

  const usedSteals = await prisma.product.findMany({
    where: {
      stockStatus: 'instock',
      NOT: {
        sizes: {
          path: '$.used',
          equals: []
        }
      }
    },
    take: 10,
    include: { brand: true, category: true },
    orderBy: { createdAt: 'desc' },
  });

  const newArrivals = await prisma.product.findMany({
    where: { stockStatus: 'instock' },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { brand: true, category: true },
  });

  return { slides, brands, visualCategories, featuredProducts, usedSteals, newArrivals };
}
