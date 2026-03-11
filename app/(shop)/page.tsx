// app/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import HeroSlider from "@/components/shared/hero-slider";
import BrandWall from "@/components/shared/brand-wall";         
import VisualCategories from "@/components/shared/visual-categories"; 
import FeaturedCarousel from "@/components/shared/featured-carousel"; // Import Carousel Baru
import BenefitsSection from "@/components/shared/benefits";
import PromoBanner from "@/components/shared/promo-banner";

export default async function HomePage() {
  const slides = await prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  const brands = await prisma.brand.findMany({});
  const visualCategories = await prisma.featuredCategory.findMany({ include: { category: true }, orderBy: { order: "asc" } });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, stockStatus: 'instock' },
    take: 15, 
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col pb-16 bg-white">
      <HeroSlider data={slides} />
      <BrandWall brands={brands} />
      <VisualCategories categories={visualCategories} />

      {/* SECTION 4: FEATURED DROPS */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 py-16">
        {featuredProducts.length > 0 ? (
          /* Kita panggil Carousel yang udah kita set 5 produk per slide sebelumnya */
          <FeaturedCarousel 
            title="Featured Drops" 
            exploreLink="/shop"
            products={featuredProducts} 
          />
        ) : (
          <div className="py-20 text-center font-bold text-muted-foreground uppercase tracking-widest text-xs opacity-50">
            No Drops Available
          </div>
        )}
      </section>

      <PromoBanner />
      <div className="mt-10">
        <BenefitsSection />
      </div>
    </div>
  );
}