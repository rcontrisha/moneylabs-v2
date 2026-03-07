"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturedCategory, Category } from "@prisma/client";
import { Button } from "@/components/ui/button";

// Gabungin tipe data FeaturedCategory + Category aslinya
type VisualCategoryData = FeaturedCategory & {
  category: Category;
};

interface VisualCategoriesProps {
  categories: VisualCategoryData[];
}

export default function VisualCategories({ categories }: VisualCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    /* SOLUSI UNTUK KONDISI 2: 
      Gua bungkus pake div 'w-full flex justify-center'. 
      Ini bakal nge-center <section> secara paksa walaupun lu ga pake mx-auto.
    */
    <div className="w-full flex justify-center">
      <section className="max-w-7xl w-full px-4 sm:px-6 lg:px-10 py-10 mx-auto">
        {/* ^ mx-auto di sini buat jaga-jaga (Kondisi 1), tapi dibantu flex parent di atas */}
        
        {/* Header Section: Judul & Line di Tengah */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <div className="mt-4 h-1 w-32 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
        </div>
        
        {/* 🚀 3-COLUMN LANDSCAPE GRID: Sejajar & Gagah */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {categories.slice(0, 3).map((item) => (
            <Link 
              key={item.id} 
              href={`/categories/${item.category.slug}`}
              // aspect-[4/3] bikin landscape yang proporsional & tinggi
              className="group relative block aspect-[4/2.5] w-full overflow-hidden rounded-lg bg-zinc-100 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Background Image w/ Zoom Effect */}
              <Image
                src={item.image || "/assets/placeholder.jpg"}
                alt={item.customName || item.category.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              {/* Dark Gradient Overlay (Footlocker Style Protection) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Content Container: Teks di kiri bawah biar estetik */}
              <div className="absolute inset-0 flex flex-col items-start justify-end p-8 lg:p-10">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white md:text-4xl leading-[0.9] mb-4 drop-shadow-xl">
                  {item.customName || item.category.name}
                </h3>
                
                {/* Button: Muncul pas hover */}
                <div className="h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-12 group-hover:opacity-100">
                  <Button 
                    variant="secondary" 
                    className="font-bold uppercase tracking-widest rounded-full px-8 py-6 text-sm shadow-xl"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}