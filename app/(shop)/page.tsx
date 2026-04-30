// app/(shop)/page.tsx
import { prisma } from "@/lib/prisma";

// Components
import HeroSlider from "@/components/shared/hero-slider";
import BrandWall from "@/components/shared/brand-wall";         
import VisualCategories from "@/components/shared/visual-categories"; 
import FeaturedCarousel from "@/components/shared/featured-carousel";
import BenefitsSection from "@/components/shared/benefits";
import PromoBanner from "@/components/shared/promo-banner";

export default async function HomePage() {
  // 1. Fetching Global Data (Paralel biar kenceng)
  const [slides, brands, visualCategories] = await Promise.all([
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.brand.findMany({}),
    prisma.featuredCategory.findMany({ include: { category: true }, orderBy: { order: "asc" } })
  ]);

  // 🚀 2. Fetching Product Sections (Corrected Logic)
  
  // Section A: Featured Drops
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, stockStatus: 'instock' },
    take: 10, 
    include: { brand: true, category: true },
    orderBy: { updatedAt: "desc" },
  });

  // 🚀 Section B: USED STEALS (The Fix)
  // Kita gak nyari di deskripsi lagi wir. Kita cek langsung ke JSON 'sizes'.
  // Logic: Cari produk yang array 'used'-nya di dalem JSON TIDAK kosong ([]).
  const usedSteals = await prisma.product.findMany({
    where: { 
      stockStatus: 'instock',
      NOT: {
        sizes: {
          path: "$.used",
          equals: [] // Filter produk yang used-nya kosong wir
        }
      }
    },
    take: 10,
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  // Section C: New Arrivals
  const newArrivals = await prisma.product.findMany({
    where: { stockStatus: 'instock' },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { brand: true, category: true },
  });

  return (
    <div className="flex flex-col pb-16 bg-white">
      {/* 1. Main Hero Area */}
      <HeroSlider data={slides} />
      
      {/* 2. Brand & Category Navigation */}
      <BrandWall brands={brands} />

      {/* 3. SECTION: NEW ARRIVALS (White BG) */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 py-16">
        <FeaturedCarousel 
          title="New Arrivals" 
          exploreLink="/shop?sort=newest"
          products={newArrivals} 
        />
      </section>

      <VisualCategories categories={visualCategories} />

      {/* 4. SECTION: FEATURED DROPS (White BG) */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 py-16">
        <FeaturedCarousel 
          title="Featured Drops" 
          exploreLink="/shop?featured=true"
          products={featuredProducts} 
        />
      </section>

      {/* 🚀 5. SECTION: USED STEALS (Zinc Alternate Section) */}
      {/* Kita kasih warna background beda dikit biar section Used ini "pop-out" */}
      <section className="w-full bg-zinc-50/50 border-y border-zinc-100">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <FeaturedCarousel 
            title="Used Steals" 
            exploreLink="/shop?condition=used"
            products={usedSteals} 
          />
        </div>
      </section>

      {/* 6. Footer Banner */}
      <div className="w-full max-w-[1600px] py-16">
        <PromoBanner />
      </div>

      {/* 7. Benefits & Trust */}
      <BenefitsSection />

    </div>
  );
}