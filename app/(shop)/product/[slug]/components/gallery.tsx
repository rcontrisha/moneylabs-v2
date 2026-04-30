// app/(shop)/product/[slug]/components/gallery.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react"; 

export function ProductGallery({ images }: { images: string[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  // 🚀 State buat nangkep interaksi user (biar auto-slide reset timer)
  const [interactionKey, setInteractionKey] = useState(0); 

  // Helper Functions buat Ganti Gambar
  const nextImage = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % images.length);
    setInteractionKey(prev => prev + 1); // Sinyal reset timer
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
    setInteractionKey(prev => prev + 1); // Sinyal reset timer
  }, [images.length]);

  const goToImage = (idx: number) => {
    setActiveIdx(idx);
    setInteractionKey(prev => prev + 1); // Sinyal reset timer
  };

  // 🚀 AUTOMATIC SLIDE LOGIC
  useEffect(() => {
    if (images.length <= 1) return;

    // Geser otomatis setiap 5 detik wir
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [images.length, interactionKey]); // Restart interval kalau user klik tombol

  return (
    <div className="flex gap-4">
      {/* 1. Vertical Thumbnails (Tetap Ada di Kiri wir) */}
      <div className="flex flex-col gap-2 w-20 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => goToImage(idx)} // Pake goToImage biar timer reset
            className={cn(
              "relative aspect-square w-full overflow-hidden border transition-all duration-300 rounded-none",
              activeIdx === idx 
                ? "border-black ring-1 ring-black p-0.5" 
                : "border-zinc-100 opacity-60 hover:border-zinc-300 hover:opacity-100"
            )}
          >
            <Image src={img} alt={`Thumb ${idx}`} fill className="object-contain p-1" />
          </button>
        ))}
      </div>

      {/* 2. Main Preview (Sekarang Berubah Jadi Carousel) */}
      <div className="relative aspect-[3/2] flex-1 bg-[#F6F6F6] border border-zinc-100 overflow-hidden group rounded-none">
        
        {/* SLIDING TRACK */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="relative flex-none w-full h-full">
                <Image
                  src={img}
                  alt={`Product detail ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className="object-contain p-12"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🚀 MANUAL NAVIGATION BUTTONS (Subtle, Sharp, Hover Only) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-none border border-zinc-200 text-zinc-600 hover:bg-black hover:text-white hover:border-black transition-all z-20 opacity-100 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-none border border-zinc-200 text-zinc-600 hover:bg-black hover:text-white hover:border-black transition-all z-20 opacity-100 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* 🚀 DOT INDICATORS (Pojok Bawah Tengah, Minimalis Ril) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToImage(idx)}
                className="group p-0.5"
              >
                <div className={cn(
                  "h-1.5 transition-all duration-300 rounded-none",
                  activeIdx === idx 
                    ? "w-5 bg-black" 
                    : "w-1.5 bg-zinc-300 hover:bg-zinc-600"
                )} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}