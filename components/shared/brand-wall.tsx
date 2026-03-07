"use client";

import Link from "next/link";
import Image from "next/image";
import { Brand } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Pastiin udah di-install

interface BrandWallProps {
  brands: Brand[];
}

export default function BrandWall({ brands }: BrandWallProps) {
  if (brands.length === 0) return null;

  return (
    <section className="w-full border-b bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-10 text-s font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          Official Retailer Of
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000, // Geser tiap 3 detik
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 flex items-center">
            {brands.map((brand) => (
                console.log(brand),
              <CarouselItem 
                key={brand.id} 
                className="basis-1/3 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Link 
                  href={`/brands/${brand.slug}`}
                  className="group relative flex h-16 w-full items-center justify-center grayscale opacity-40 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
                >
                  <div className="relative h-10 w-28">
                    <Image
                      src={brand.image || "/assets/placeholder.svg"} 
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}