import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding (Dynamic Pricing & Condition Expansion)...')

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

  // 4. Bikin Brand (URL Tetap)
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

  const brandMap: Record<string, any> = {}
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b })
    brandMap[b.slug] = brand
  }

  // 5. Bikin Kategori
  const catSneakers = await prisma.category.create({ data: { name: 'Sneakers', slug: 'sneakers' } })
  const catRunning = await prisma.category.create({ data: { name: 'Running', slug: 'running' } })
  const catBasketball = await prisma.category.create({ data: { name: 'Basketball', slug: 'basketball' } })
  const catCasual = await prisma.category.create({ data: { name: 'Casual', slug: 'casual' } })

  // 6. SETUP VISUAL CATEGORIES
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
        image: "https://images.unsplash.com/photo-1597586785094-c9c247ec343f?q=80&w=1170&auto=format&fit=crop",
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

  // 7. Bikin Produk (Dynamic JSON Sizes & Pricing)
  const productsToSeed = [
    // NIKE (3)
    { name: 'Nike Air Max 97', slug: 'nike-am-97', brand: 'nike', cat: catSneakers, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', featured: true },
    { name: 'Nike Dunk Low Panda', slug: 'nike-dunk-panda', brand: 'nike', cat: catSneakers, img: 'https://images.unsplash.com/photo-1600054820977-1d1996a4fe17', featured: true },
    { name: 'Nike Pegasus 40', slug: 'nike-peg-40', brand: 'nike', cat: catRunning, img: 'https://images.unsplash.com/photo-1539185441755-769473a23570', featured: false },

    // ADIDAS (3)
    { name: 'Adidas Ultraboost Light', slug: 'adidas-ub-light', brand: 'adidas', cat: catRunning, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5', featured: true },
    { name: 'Adidas Samba OG', slug: 'adidas-samba-og', brand: 'adidas', cat: catSneakers, img: 'https://images.unsplash.com/photo-1626379616459-b2ce1d9decbb', featured: false },
    { name: 'Adidas Forum Low', slug: 'adidas-forum', brand: 'adidas', cat: catSneakers, img: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f', featured: false },

    // NEW BALANCE (3)
    { name: 'NB 550 White Green', slug: 'nb-550-wg', brand: 'new-balance', cat: catSneakers, img: 'https://images.unsplash.com/photo-1636138241433-727977464d60', featured: true },
    { name: 'NB 2002R Protection Pack', slug: 'nb-2002r-pp', brand: 'new-balance', cat: catSneakers, img: 'https://images.unsplash.com/photo-1628413993904-94ecb60f1239', featured: true },
    { name: 'NB 9060 Driftwood', slug: 'nb-9060-dw', brand: 'new-balance', cat: catSneakers, img: 'https://images.unsplash.com/photo-1662581876444-5e74b3528654', featured: false },

    // PUMA (3)
    { name: 'Puma Suede Classic', slug: 'puma-suede', brand: 'puma', cat: catSneakers, img: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329', featured: false },
    { name: 'Puma MB.03 Toxic', slug: 'puma-mb03', brand: 'puma', cat: catBasketball, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa', featured: true },
    { name: 'Puma RS-X Efekt', slug: 'puma-rsx', brand: 'puma', cat: catSneakers, img: 'https://images.unsplash.com/photo-1534653299134-96a171b61581', featured: false },

    // REEBOK (3)
    { name: 'Reebok Club C 85', slug: 'reebok-club-c', brand: 'reebok', cat: catSneakers, img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1', featured: false },
    { name: 'Reebok Classic Leather', slug: 'reebok-classic', brand: 'reebok', cat: catSneakers, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', featured: false },
    { name: 'Reebok Pump Omni Zone', slug: 'reebok-pump', brand: 'reebok', cat: catBasketball, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', featured: true },

    // ASICS (3)
    { name: 'Asics Gel-Kayano 30', slug: 'asics-kayano', brand: 'asics', cat: catRunning, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa', featured: true },
    { name: 'Asics GT-2160', slug: 'asics-gt2160', brand: 'asics', cat: catRunning, img: 'https://images.unsplash.com/photo-1628413993904-94ecb60f1239', featured: false },
    { name: 'Asics Gel-NYC', slug: 'asics-gel-nyc', brand: 'asics', cat: catSneakers, img: 'https://images.unsplash.com/photo-1636138241433-727977464d60', featured: true },

    // VANS (3)
    { name: 'Vans Old Skool', slug: 'vans-old-skool', brand: 'vans', cat: catSneakers, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77', featured: false },
    { name: 'Vans Sk8-Hi', slug: 'vans-sk8hi', brand: 'vans', cat: catSneakers, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35', featured: false },
    { name: 'Vans Knu Skool', slug: 'vans-knu', brand: 'vans', cat: catSneakers, img: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f', featured: true },

    // CONVERSE (3)
    { name: 'Converse Chuck 70 High', slug: 'converse-c70-h', brand: 'converse', cat: catSneakers, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35', featured: false },
    { name: 'Converse Run Star Hike', slug: 'converse-runstar', brand: 'converse', cat: catSneakers, img: 'https://images.unsplash.com/photo-1636138241433-727977464d60', featured: true },
    { name: 'Converse Weapon', slug: 'converse-weapon', brand: 'converse', cat: catBasketball, img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3', featured: false },

    // JORDAN (3)
    { name: 'Jordan 1 High Royal', slug: 'jordan-1-royal', brand: 'jordan', cat: catBasketball, img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3', featured: true },
    { name: 'Jordan 4 Military Blue', slug: 'jordan-4-military', brand: 'jordan', cat: catBasketball, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', featured: true },
    { name: 'Jordan 11 Gratitude', slug: 'jordan-11-grat', brand: 'jordan', cat: catBasketball, img: 'https://images.unsplash.com/photo-1584739090186-e257756fd1e7', featured: true },

    // UNDER ARMOUR (3)
    { name: 'UA Curry 11', slug: 'ua-curry-11', brand: 'under-armour', cat: catBasketball, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', featured: true },
    { name: 'UA HOVR Phantom 3', slug: 'ua-hovr-3', brand: 'under-armour', cat: catRunning, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa', featured: false },
    { name: 'UA Spawn 5', slug: 'ua-spawn-5', brand: 'under-armour', cat: catBasketball, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', featured: false },
  ]

  for (const p of productsToSeed) {
    // 🚀 GENERATE VARIATIVE SIZES & CONDITIONS
    const sizes = {
      new: [
        { size: "40", regularPrice: 2000000 + (Math.random() * 1000000), salePrice: null, stock: Math.floor(Math.random() * 10) + 1 },
        { size: "42", regularPrice: 2200000 + (Math.random() * 1000000), salePrice: 1999000, stock: Math.floor(Math.random() * 5) + 1 },
        { size: "44", regularPrice: 2100000 + (Math.random() * 1000000), salePrice: null, stock: Math.floor(Math.random() * 15) + 1 }
      ],
      used: Math.random() > 0.3 ? [ // 70% chance have used items
        { 
          size: "42", 
          regularPrice: 1200000 + (Math.random() * 500000), 
          salePrice: null, 
          stock: 1, 
          condition: `${(7 + Math.random() * 2.5).toFixed(1)}/10`, 
          defects: ["Slight yellowing", "Minor heel drag"], 
          includes: ["Original Box", "Replacement Laces"] 
        },
        { 
          size: "43", 
          regularPrice: 900000 + (Math.random() * 500000), 
          salePrice: null, 
          stock: 1, 
          condition: "6.5/10", 
          defects: ["Deep creasing", "No box"], 
          includes: ["Shoes only"] 
        }
      ] : []
    }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        image: `${p.img}?q=80&w=800&auto=format&fit=crop`,
        brandId: brandMap[p.brand].id,
        categoryId: p.cat.id,
        sizes: sizes,
        featured: p.featured,
        quantity: 25,
        stockStatus: 'instock'
      },
    })
  }

  console.log('✅ Seeding Selesai! 30 Produk variatif siap tempur.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })