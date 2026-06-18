"use client";

import { Suspense } from "react";
import { Brand, Category } from "@prisma/client";
import FilterSidebar from "@/components/shop/filter-sidebar";

interface FilterDrawerProps {
  brands: Brand[];
  categories: Category[];
  maxPrice: number;
}

export default function FilterDrawer({ brands, categories, maxPrice }: FilterDrawerProps) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          const panel = e.currentTarget.nextElementSibling as HTMLElement;
          panel?.classList.toggle("hidden");
        }}
        className="flex items-center gap-2 border border-zinc-300 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
      >
        Filters
        <span className="text-zinc-400">↓</span>
      </button>
      <div className="hidden absolute top-full left-0 mt-2 z-40 bg-white border border-zinc-200 p-4 w-64 shadow-lg">
        <Suspense fallback={null}>
          <FilterSidebar brands={brands} categories={categories} maxPrice={maxPrice} />
        </Suspense>
      </div>
    </div>
  );
}
