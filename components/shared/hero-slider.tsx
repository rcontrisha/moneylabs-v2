// components/shared/hero-slider.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"; // Opsional: Biar geser sendiri

// Definisikan tipe data sesuai Prisma Model lu
interface HeroSlideProps {
  data: {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    ctaText: string;
    ctaLink: string;
  }[];
}

export default function HeroSlider({ data }: HeroSlideProps) {
  return (
    <section className="w-full bg-gray-50">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {data.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full h-[500px] md:h-[600px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover brightness-75" // Gelapin dikit biar teks kebaca
                  priority
                />
              </div>

              {/* Text Content */}
              <div className="relative h-full flex items-center justify-center text-center">
                <div className="max-w-3xl px-4 space-y-6">
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl font-medium text-white/90 tracking-widest uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
                      {slide.subtitle}
                    </p>
                  )}
                  <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    {slide.title}
                  </h1>
                  <div className="pt-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                    <Button asChild size="lg" className="rounded-full px-8 text-lg h-12">
                      <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Tombol Navigasi (Panah Kiri Kanan) */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}