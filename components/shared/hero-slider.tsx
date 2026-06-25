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

interface HeroSlide {
  id: string;
  title?: string;
  subtitle?: string | null;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroSliderProps {
  data: HeroSlide[];
  compact?: boolean;
}

export default function HeroSlider({ data, compact = false }: HeroSliderProps) {
  // If no slides provided from CMS, fall back to three local banner images.
  const defaultSlides = [
    { id: "fallback-1", title: "", subtitle: null, image: "/assets/banner/hero-banner-1.png", ctaText: "", ctaLink: "/shop" },
    { id: "fallback-2", title: "", subtitle: null, image: "/assets/banner/hero-banner-2.png", ctaText: "", ctaLink: "/shop" },
    { id: "fallback-3", title: "", subtitle: null, image: "/assets/banner/hero-banner-3.png", ctaText: "", ctaLink: "/shop" },
  ];

  const slidesToRender = (data && data.length > 0) ? data : defaultSlides;
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
    <section className="w-full relative">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {slidesToRender.map((slide, idx) => (
            /* compact uses smaller heights for admin preview */
            <CarouselItem
              key={slide.id}
              className={compact ? "relative w-full h-[175px] md:h-[320px] lg:h-[360px]" : "relative w-full h-[175px] md:h-[650px] lg:h-[75vh] lg:min-h-[600px] lg:max-h-[750px] bg-zinc-950"}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-zinc-800">
                <Image
                  src={slide.image}
                  alt={slide.title ?? ""}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={idx === 0}
                  fetchPriority={idx === 0 ? "high" : undefined}
                />
              </div>

              {/* Content Container - render only when slide has a title */}
              {/* hide heavy content when in compact preview mode */}
              {!compact && slide.title ? (
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
                    <h1 className="text-[clamp(2rem,8vw,5rem)] md:text-[clamp(3.5rem,8vw,7rem)] lg:text-[clamp(5rem,10vw,8rem)] font-black uppercase italic tracking-tighter text-white leading-[0.85] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 max-w-full">
                      {slide.title.split(" ").slice(0, -1).join(" ")} <br />
                      <span className="text-transparent stroke-text">
                        {slide.title.split(" ").slice(-1)}
                      </span>
                    </h1>

                    {/* CTA Button */}
                    <div className="pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                      <Button asChild size="lg" className="h-12 md:h-14 px-10 md:px-12 rounded-full font-bold uppercase tracking-widest text-base bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                        <Link href={slide.ctaLink ?? "/shop"}>{slide.ctaText}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </CarouselItem>
          ))}
        </CarouselContent>

  {/* 🚀 DOTS INDICATOR: Ditaruh di dalem gambar (paling bawah) */}
  <div className={compact ? "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30" : "max-sm:static max-sm:justify-center max-sm:py-2 max-sm:translate-x-0 absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30"}>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 transition-all duration-300 rounded-full",
                current === index 
                  ? "w-10 max-sm:bg-black max-sm:shadow-none bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" 
                  : "w-2 max-sm:bg-zinc-300 max-sm:hover:bg-zinc-400 bg-white/40 hover:bg-white/60"
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