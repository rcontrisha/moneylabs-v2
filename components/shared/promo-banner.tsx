"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    // 1. Full-bleed: Tetap mentok layar biar panggungnya luas
    <section className="w-full bg-zinc-950 overflow-hidden relative">
      
      {/* 🚀 MOBILE-FRIENDLY REFACTOR: 
         - Mobile & Tablet (< lg): Pake konsep 'Overlay' (Teks di atas gambar) biar gak 'stacked' panjang.
         - Desktop (lg+): Tetap 'Split Layout' biar cinematic dan seimbang.
      */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[500px] xl:min-h-[600px]">
        
        {/* 1. Visual Asset Layer: Menjadi background di mobile, menjadi kolom di desktop */}
        <div className="absolute inset-0 lg:relative lg:inset-auto h-full group">
          <Image
            src="https://images.unsplash.com/photo-1597460832932-1f573c318d57?q=80&w=1170&auto=format&fit=crop" 
            alt="Promo Shoe"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Dark Overlay for Mobile/Tablet: 
             Biar teks putih tetep kontras dan gampang dibaca di atas gambar. 
          */}
          <div className="absolute inset-0 bg-black/60 lg:hidden" />
          
          {/* Gradient Overlay for Desktop: Nyambungin gambar ke background hitam kolom teks */}
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-l from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* 2. Typography & CTA Layer: Background transparan di mobile, hitam solid di desktop */}
        <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-20 bg-transparent lg:bg-zinc-950">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                Limited Time Offer
              </p>
            </div>
            
            {/* Responsif Font: Lebih kecil di mobile (4xl) biar gak menuhi layar, raksasa di desktop */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.85]">
              Mid-Season <br />
              <span className="text-transparent stroke-text">Madness</span>
            </h2>

            <p className="max-w-md text-base sm:text-lg text-zinc-300 lg:text-zinc-400 font-medium leading-relaxed">
              Dapetin diskon gila-gilaan sampe <span className="text-white font-bold underline decoration-primary underline-offset-4">50%</span> buat sepatu lari dan casual. Stok terbatas!
            </p>

            {/* Button wrapping biar aman di layar kecil */}
            <div className="pt-4 sm:pt-6 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 sm:h-14 px-8 sm:px-10 rounded-full font-white uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105">
                <Link href="/shop">Shop Sale</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-transparent text-white border-white/20 hover:bg-white hover:text-black font-black uppercase tracking-widest transition-all">
                <Link href="/categories">Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px white;
          text-shadow: none;
        }
        @media (min-width: 640px) {
          .stroke-text {
            -webkit-text-stroke: 2px white;
          }
        }
      `}</style>
    </section>
  );
}