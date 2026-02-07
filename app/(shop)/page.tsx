import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/shared/hero-slider";
import ProductCard from "@/components/shared/product-card"; // 👈 Import ini
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  // 1. Ambil Data Slider
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  // 2. Ambil Data Featured Products (Limit 4 atau 8 biar rapi)
  const featuredProducts = await prisma.product.findMany({
    where: { 
      featured: true,
      stockStatus: 'instock' // Cuma tampilin yang ready stock
    },
    take: 8, // Ambil 8 produk
    include: {
      brand: true,    // Include relasi Brand biar namanya muncul
      category: true, // Include relasi Category
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <HeroSlider data={slides} />

      {/* Featured Products Section */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Featured <span className="text-primary">Drops</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Koleksi pilihan terbaik minggu ini. Jangan sampe keabisan wir!
            </p>
          </div>
          <Button variant="link" asChild className="hidden md:flex gap-2 text-black font-bold">
            <Link href="/shop">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Product Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            Belum ada produk featured nih. Coba seed ulang database lu wir.
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center md:hidden">
           <Button asChild variant="outline" className="w-full">
              <Link href="/shop">View All Products</Link>
           </Button>
        </div>
      </section>
    </div>
  );
}