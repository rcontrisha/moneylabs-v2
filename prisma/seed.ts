// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding...')

  // 1. Reset Database (Hapus data lama biar gak duplikat)
  await prisma.orderItem.deleteMany()
  await prisma.transaction.deleteMany() // Tambahin ini biar aman relasinya
  await prisma.order.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.heroSlide.deleteMany()
  await prisma.siteConfig.deleteMany()
  await prisma.user.deleteMany()

  // 2. Bikin User Admin
  await prisma.user.create({
    data: {
      name: 'Admin Ganteng',
      email: 'admin@moneylabs.com',
      password: 'password123',
      role: 'ADMIN',
      mobile: '08123456789',
    },
  })

  // 3. Bikin Config Website
  await prisma.siteConfig.create({
    data: {
      id: 'config_main',
      siteName: 'MoneyLabs Official',
      announcementBar: 'Diskon Spesial Imlek up to 70%!',
      whatsapp: '6281234567890',
    },
  })

  // 4. Bikin CMS Slider (Hero)
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'New Arrival 2024',
        subtitle: 'Koleksi Sepatu Terbaik Musim Ini',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        ctaText: 'Belanja Sekarang',
        ctaLink: '/shop',
        order: 1,
      },
      {
        title: 'Nike Air Jordan',
        subtitle: 'Diskon 30% Khusus Member',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
        ctaText: 'Cek Detail',
        ctaLink: '/product/nike-air-jordan',
        order: 2,
      },
    ],
  })

  // 5. Bikin Kategori & Brand
  const nike = await prisma.brand.create({
    data: { name: 'Nike', slug: 'nike' },
  })
  
  const adidas = await prisma.brand.create({
    data: { name: 'Adidas', slug: 'adidas' },
  })

  const sneakers = await prisma.category.create({
    data: { name: 'Sneakers', slug: 'sneakers' },
  })

  // 6. Bikin Produk
  await prisma.product.create({
    data: {
      name: 'Nike Air Max 97',
      slug: 'nike-air-max-97',
      shortDesc: 'Sepatu lari paling nyaman sedunia.',
      description: 'Lorem ipsum dolor sit amet...',
      regularPrice: 2500000,
      salePrice: 2100000,
      stockStatus: 'instock',
      quantity: 50,
      featured: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070',
      brandId: nike.id,
      categoryId: sneakers.id,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Adidas Ultraboost',
      slug: 'adidas-ultraboost',
      shortDesc: 'Boost your run with energy return.',
      description: 'Lorem ipsum dolor sit amet...',
      regularPrice: 3000000,
      stockStatus: 'instock',
      quantity: 20,
      featured: true,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974',
      brandId: adidas.id,
      categoryId: sneakers.id,
    },
  })

  console.log('✅ Seeding Selesai! Database udah ada isinya.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })