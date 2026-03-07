import { PrismaClient, Brand } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding (Massive Data Expansion)...')

  // 1. Reset Database
  await prisma.orderItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.order.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.product.deleteMany()
  await prisma.featuredCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.heroSlide.deleteMany()
  await prisma.siteConfig.deleteMany()
  await prisma.user.deleteMany()

  // 2. Bikin User Admin & Config
  await prisma.user.create({
    data: {
      name: 'Admin Ganteng',
      email: 'admin@moneylabs.com',
      password: 'password123',
      role: 'ADMIN',
      mobile: '08123456789',
    },
  })

  await prisma.siteConfig.create({
    data: {
      id: 'config_main',
      siteName: 'MoneyLabs Official',
      announcementBar: 'Diskon Spesial Imlek up to 70%!',
      whatsapp: '6281234567890',
    },
  })

  // 3. Bikin CMS Slider (Gambar Hero)
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'New Arrival 2026',
        subtitle: 'Koleksi Sepatu Terbaik Musim Ini',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070', 
        ctaText: 'Belanja Sekarang',
        ctaLink: '/shop',
        order: 1,
      },
      {
        title: 'Nike Air Jordan',
        subtitle: 'Diskon 30% Khusus Member',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070',
        ctaText: 'Cek Detail',
        ctaLink: '/shop',
        order: 2,
      },
    ],
  })

  // 4. Bikin Brand (10 Brand)
  const brandsData = [
    { name: 'Nike', slug: 'nike', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', slug: 'adidas', image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'New Balance', slug: 'new-balance', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg' },
    { name: 'Puma', slug: 'puma', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma-logo-%28text%29.svg' },
    { name: 'Reebok', slug: 'reebok', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Reebok_2019_logo.svg/960px-Reebok_2019_logo.svg.png?20200702085200' },
    { name: 'Asics', slug: 'asics', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Asics_Logo.svg/500px-Asics_Logo.svg.png?20160212144707' },
    { name: 'Vans', slug: 'vans', image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Vans_%28brand%29_logo.svg' },
    { name: 'Converse', slug: 'converse', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/1280px-Converse_logo.svg.png?20210517161238' },
    { name: 'Jordan', slug: 'jordan', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/960px-Jumpman_logo.svg.png' },
    { name: 'Under Armour', slug: 'under-armour', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Under_armour_logo.svg/500px-Under_armour_logo.svg.png?20220804034106' },
  ]
  
  const brandMap: Record<string, Brand> = {}
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b })
    brandMap[b.slug] = brand
  }

  // 5. Bikin Kategori (Expanded)
  const catSneakers = await prisma.category.create({ data: { name: 'Sneakers', slug: 'sneakers' } })
  const catRunning = await prisma.category.create({ data: { name: 'Running', slug: 'running' } })
  const catBasketball = await prisma.category.create({ data: { name: 'Basketball', slug: 'basketball' } })
  const catTraining = await prisma.category.create({ data: { name: 'Training', slug: 'training' } })
  const catCasual = await prisma.category.create({ data: { name: 'Casual', slug: 'casual' } })

  // 6. SETUP VISUAL CATEGORIES (CMS)
  await prisma.featuredCategory.createMany({
    data: [
      {
        categoryId: catSneakers.id,
        customName: "MEN'S SNEAKERS",
        image: "https://images.unsplash.com/flagged/photo-1556746834-cbb4a38ee593?q=80&w=1172&auto=format&fit=crop",
        order: 1
      },
      {
        categoryId: catRunning.id,
        customName: "WOMEN'S RUNNING",
        image: "https://images.unsplash.com/photo-1509833903111-9cb142f644e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8",
        order: 2
      },
      {
        categoryId: catCasual.id,
        customName: "KIDS COLLECTION",
        image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1170&auto=format&fit=crop",
        order: 3
      }
    ]
  })

  // 7. Bikin Produk (Massive Expansion - 20 Items)
  const products = [
    // NIKE
    { name: 'Nike Air Max 97', slug: 'nike-air-max-97', price: 2500000, featured: true, brand: 'nike', cat: catSneakers, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { name: 'Nike Dunk Low Retro', slug: 'nike-dunk-low', price: 1700000, featured: true, brand: 'nike', cat: catSneakers, img: 'https://images.unsplash.com/photo-1743573874967-d27623402d44?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Nike Pegasus 40', slug: 'nike-pegasus-40', price: 1900000, featured: false, brand: 'nike', cat: catRunning, img: 'https://images.unsplash.com/photo-1539185441755-769473a23570' },
    
    // JORDAN
    { name: 'Jordan 1 Retro High OG', slug: 'jordan-1-retro', price: 3200000, featured: true, brand: 'jordan', cat: catBasketball, img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3' },
    { name: 'Jordan 4 Military Blue', slug: 'jordan-4-military', price: 3500000, featured: true, brand: 'jordan', cat: catBasketball, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a' },

    // ADIDAS
    { name: 'Adidas Ultraboost Light', slug: 'adidas-ultraboost', price: 3000000, featured: true, brand: 'adidas', cat: catRunning, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5' },
    { name: 'Adidas Forum Low', slug: 'adidas-forum-low', price: 1600000, featured: false, brand: 'adidas', cat: catSneakers, img: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f' },
    { name: 'Adidas Stan Smith', slug: 'adidas-stan-smith', price: 1500000, featured: false, brand: 'adidas', cat: catCasual, img: 'https://images.unsplash.com/photo-1589187151032-573a91d170bd' },

    // NEW BALANCE
    { name: 'New Balance 997H', slug: 'nb-997h', price: 2100000, featured: true, brand: 'new-balance', cat: catSneakers, img: 'https://images.unsplash.com/photo-1621315271772-28b1f3a5df87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'New Balance 2002R', slug: 'nb-2002r', price: 2400000, featured: true, brand: 'new-balance', cat: catSneakers, img: 'https://images.unsplash.com/photo-1628413993904-94ecb60f1239' },

    // ASICS & PUMA
    { name: 'Asics Novablast 4', slug: 'asics-novablast-4', price: 2200000, featured: false, brand: 'asics', cat: catRunning, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa' },
    { name: 'Puma Suede Classic', slug: 'puma-suede-classic', price: 1200000, featured: false, brand: 'puma', cat: catCasual, img: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329' },

    // VANS & CONVERSE
    { name: 'Vans Old Skool Black', slug: 'vans-old-skool', price: 1000000, featured: false, brand: 'vans', cat: catCasual, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77' },
    { name: 'Converse Chuck 70', slug: 'converse-chuck-70', price: 1100000, featured: false, brand: 'converse', cat: catCasual, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35' },

    // OTHERS
    { name: 'Under Armour Curry 7', slug: 'ua-curry-7', price: 2800000, featured: true, brand: 'under-armour', cat: catBasketball, img: 'https://images.unsplash.com/photo-1604726923839-606d2f0e0870?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Reebok Club C 85', slug: 'reebok-club-c', price: 1300000, featured: false, brand: 'reebok', cat: catCasual, img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1' }
  ]

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        regularPrice: p.price,
        stockStatus: 'instock',
        featured: p.featured,
        image: `${p.img}?q=80&w=800&auto=format&fit=crop`,
        brandId: brandMap[p.brand].id,
        categoryId: p.cat.id,
      },
    })
  }

  console.log(`✅ Seeding Selesai! Berhasil nambahin ${products.length} produk lintas brand.`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })