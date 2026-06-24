// app/(shop)/page.tsx
import { getLandingData } from '@/lib/actions/landing';

// Components
import HeroSlider from "@/components/shared/hero-slider";
import BrandWall from "@/components/shared/brand-wall";         
import VisualCategories from "@/components/shared/visual-categories"; 
import FeaturedCarousel from "@/components/shared/featured-carousel";
import BenefitsSection from "@/components/shared/benefits";
import PromoBanner from "@/components/shared/promo-banner";

export default async function HomePage() {
  const { slides, brands, visualCategories, featuredProducts, usedSteals, newArrivals } = await getLandingData();

  return (
    <div className="flex flex-col lg:pb-16 pb-0 bg-white">
      {/* 1. Main Hero Area */}
      <HeroSlider data={slides} />
      
      {/* 2. Brand & Category Navigation */}
      <BrandWall brands={brands} />

      {/* 3. SECTION: NEW ARRIVALS (White BG) */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 lg:py-16 py-8">
        <FeaturedCarousel 
          title="New Arrivals" 
          exploreLink="/shop?sort=newest"
          products={newArrivals} 
        />
      </section>

      <VisualCategories categories={visualCategories} />

      {/* 4. SECTION: FEATURED DROPS (White BG) */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 lg:py-16 py-8">
        <FeaturedCarousel 
          title="Featured Drops" 
          exploreLink="/shop?featured=true"
          products={featuredProducts} 
        />
      </section>

      {/* 🚀 5. SECTION: USED STEALS (Zinc Alternate Section) */}
      {/* Kita kasih warna background beda dikit biar section Used ini "pop-out" */}
      <section className="w-full bg-zinc-50/50 border-y border-zinc-100 lg:py-16 py-8">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <FeaturedCarousel 
            title="Used Steals" 
            exploreLink="/shop?condition=used"
            products={usedSteals}
          />
        </div>
      </section>

      {/* 6. Footer Banner */}
      <div className="mx-auto w-full max-w-[1600px] lg:py-16 py-0">
        <PromoBanner />
      </div>

      {/* 7. Benefits & Trust */}
      <BenefitsSection />

    </div>
  );
}