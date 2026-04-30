// components/shared/visual-categories.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturedCategory, Category } from "@prisma/client";
import { cn } from "@/lib/utils";

type VisualCategoryData = FeaturedCategory & {
  category: Category;
};

interface VisualCategoriesProps {
  categories: VisualCategoryData[];
}

export default function VisualCategories({ categories }: VisualCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
      <div className="mb-12 flex flex-col items-start text-left">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
          Shop by <span className="text-zinc-400">Category</span>
        </h2>
        <div className="mt-4 h-1.5 w-20 bg-black rounded-none" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((item) => (
          <Link 
            key={item.id} 
            href={`/shop?category=${item.category.slug}`}
            className="group relative aspect-[4/5] overflow-hidden bg-zinc-100 rounded-none border border-zinc-100"
          >
            {/* 🚀 FIX: Pake item.image (dari FeaturedCategory) dulu wir! */}
            <Image 
              src={item.image || item.category.image || "/assets/placeholder.svg"} 
              alt={item.customName || item.category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-500" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
              <div className="h-1 w-0 bg-black group-hover:w-16 transition-all duration-500 rounded-none mb-4" />
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black leading-[0.8] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Go to <br/> {item.customName || item.category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}