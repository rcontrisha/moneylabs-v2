"use client";

import * as React from "react";
import Link from "next/link";
import { Product, Brand, Category } from "@prisma/client";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"; // Pake icon panah yang tegas

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi, // Import tipe API
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedCarouselProps {
  title: string; // Terima judul sebagai props
  exploreLink: string; // Terima link explore sebagai props
  products: (Product & {
    brand: Brand | null;
    category: Category | null;
  })[];
}

export default function FeaturedCarousel({ title, exploreLink, products }: FeaturedCarouselProps) {
  // 1. State untuk nyimpen API carousel biar bisa dikontrol tombol luar
  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Fungsi helper buat scroll
  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  return (
    <div className="w-full"> {/* Container utama dikasih padding */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        
        {/* Bagian Kiri: Judul & Garis */}
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            {title}
          </h2>
          <div className="mt-4 h-1.5 w-20 bg-black rounded-none" />
        </div>

        {/* Bagian Kanan: Navigasi & Explore Link */}
        <div className="flex items-center gap-6 self-end">
          
          {/* Custom Navigation Buttons (Gaya Kotak/Tegas) */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="h-10 w-10 rounded-none border-2 border-black bg-transparent hover:bg-black hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="h-10 w-10 rounded-none border-2 border-black bg-transparent hover:bg-black hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Separator kecil (opsional) */}
          <div className="hidden md:block h-6 w-px bg-zinc-300" />

          {/* Explore All Link */}
          <Button variant="link" asChild className="p-0 text-black font-bold uppercase tracking-widest text-sm hover:no-underline group">
            <Link href={exploreLink} className="flex items-center gap-1">
              Explore All 
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* --- CAROUSEL CONTENT --- */}
      <Carousel
        setApi={setApi} // Pass setter API ke sini
        opts={{ align: "start", loop: true }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard data={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}