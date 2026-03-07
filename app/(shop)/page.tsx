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

  // Tarik produk (pastikan jumlahnya cukup banyak biar bisa di-scroll, misal 20)
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, stockStatus: 'instock' },
    take: 20, 
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col pb-16">
      <HeroSlider data={slides} />
      <BrandWall brands={brands} />
      <VisualCategories categories={visualCategories} />

      {/* SECTION 4: FEATURED DROPS (Refactored) */}
      {/* Container max-w-1600px tetep dipake di luar biar konsisten */}
      <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 overflow-hidden">
        {featuredProducts.length > 0 ? (
          // Kita panggil komponen baru dengan props title dan link
          <FeaturedCarousel 
            title="Featured Drops" 
            exploreLink="/shop"
            products={featuredProducts} 
          />
        ) : (
          <div className="py-20 text-center font-bold text-muted-foreground uppercase tracking-widest">
            No Drops Available
          </div>
        )}
      </section>

      <PromoBanner />
      <BenefitsSection />
    </div>
  );
}