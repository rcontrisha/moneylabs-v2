// components/shared/product-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, Brand, Category } from "@prisma/client";
import { Heart } from "lucide-react"; 

interface SizeVariant {
  size: string;
  regularPrice: number;
  salePrice: number | null;
  stock: number;
}

interface ProductSizes {
  new: SizeVariant[];
  used: (SizeVariant & { condition: string })[];
}

interface ProductCardProps {
  data: Product & {
    brand: Brand | null;
    category: Category | null;
  };
}

export default function ProductCard({ data }: ProductCardProps) {
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const sizes = data.sizes as unknown as ProductSizes;
  
  // 🚀 Logic deteksi ketersediaan kondisi [cite: 10]
  const availability = {
    hasNew: (sizes?.new?.length ?? 0) > 0,
    hasUsed: (sizes?.used?.length ?? 0) > 0
  };

  const getPricingInfo = () => {
    if (!sizes) return { minPrice: 0, hasDiscount: false };
    const allVariants = [...(sizes.new || []), ...(sizes.used || [])];
    if (allVariants.length === 0) return { minPrice: 0, hasDiscount: false };

    const prices = allVariants.map(v => v.salePrice || v.regularPrice);
    return {
      minPrice: Math.min(...prices),
      hasDiscount: allVariants.some(v => v.salePrice !== null),
    };
  };

  const { minPrice, hasDiscount } = getPricingInfo();

  return (
    <div className="group flex w-full flex-col gap-2 bg-white transition-all duration-300">
      
      {/* 1. Image Container: Compact Rectangular  */}
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-[#F6F6F6] border border-zinc-100/50">
        <Image
          src={data.image || "/assets/placeholder.svg"}
          alt={data.name}
          fill
          sizes="(max-width: 100%) 50vw, 20vw"
        />

        {/* Minimalist Sale Badge: Hitam Solid  */}
        {hasDiscount && (
          <div className="absolute left-0 top-0 bg-black px-2 py-1 text-[8px] font-black uppercase text-white tracking-widest z-10">
            Sale
          </div>
        )}

        {/* 🚀 2. RE-DESIGNED CONDITION BADGES: Sharp & Solid  */}
        <div className="absolute right-0 top-0 flex z-10">
          {availability.hasNew && (
            <div className="bg-white px-1 border-t border-r border-zinc-100">
              <span className="text-[8px] font-black uppercase text-zinc-900 tracking-tighter">New</span>
            </div>
          )}
          {availability.hasUsed && (
            <div className="bg-zinc-900 px-1">
              <span className="text-[8px] font-black uppercase text-white tracking-tighter">Used</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Content Info: Typography Sharp & Tight  */}
      <div className="flex flex-col px-1 pt-1">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {data.brand?.name}
        </span>

        <Link href={`/product/${data.slug}`} className="mt-0.5">
          <h3 className="line-clamp-1 text-[11px] font-bold uppercase tracking-tight text-zinc-900 group-hover:text-zinc-500 transition-colors">
            {data.name}
          </h3>
        </Link>

        <div className="mt-1 flex flex-col">
          <span className="text-xs font-black tracking-tighter text-zinc-950">
            {formatRupiah(minPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}