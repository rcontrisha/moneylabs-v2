// components/shared/hero-slider.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

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
  // 1. Setup API buat ngontrol state dots
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  // 2. Hook buat monitoring perubahan slide
  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="w-full bg-zinc-950 relative">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {data.map((slide) => (
            /* Tetap pake 75vh biar Brand Wall di bawahnya kelihatan dikit */
            <CarouselItem key={slide.id} className="relative w-full h-[550px] md:h-[650px] lg:h-[75vh] min-h-[600px] lg:max-h-[750px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover brightness-50" 
                  priority
                />
              </div>

              {/* Content Container */}
              <div className="relative h-full flex items-center justify-center text-center">
                <div className="max-w-5xl px-4 flex flex-col items-center">
                  
                  {/* Subtitle */}
                  {slide.subtitle && (
                    <div className="mb-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <span className="h-px w-8 bg-primary md:w-12" />
                      <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-primary">
                        {slide.subtitle}
                      </p>
                      <span className="h-px w-8 bg-primary md:w-12" />
                    </div>
                  )}

                  {/* Massive Typography */}
                  <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-black uppercase italic tracking-tighter text-white leading-[0.85] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                    {slide.title.split(' ').slice(0, -1).join(' ')} <br />
                    <span className="text-transparent stroke-text">
                      {slide.title.split(' ').slice(-1)}
                    </span>
                  </h1>

                  {/* CTA Button */}
                  <div className="pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <Button asChild size="lg" className="h-12 md:h-14 px-10 md:px-12 rounded-full font-bold uppercase tracking-widest text-base bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                      <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 🚀 DOTS INDICATOR: Ditaruh di dalem gambar (paling bawah) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 transition-all duration-300 rounded-full",
                current === index 
                  ? "w-10 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px white;
          text-shadow: none;
        }
        @media (min-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 2.5px white;
          }
        }
      `}</style>
    </section>
  );
}