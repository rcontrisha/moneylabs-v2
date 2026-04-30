// app/(shop)/product/[slug]/components/product-info.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ProductInfo({ product }: { product: any }) {
  const [condition, setCondition] = useState<"new" | "used">("new");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = product.sizes as any;
  const currentVariants = condition === "new" ? sizes?.new || [] : sizes?.used || [];

  // 🚀 LOGIC PRICING DINAMIS
  const pricing = useMemo(() => {
    const variant = currentVariants.find((v: any) => v.size === selectedSize);
    
    if (variant) {
      return {
        isVariant: true,
        regularPrice: variant.regularPrice,
        salePrice: variant.salePrice,
      };
    }
    
    // Kalau belum pilih size, cari harga terendah buat "Start From"
    const prices = currentVariants.map((v: any) => v.salePrice || v.regularPrice);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    
    return {
      isVariant: false,
      minPrice,
    };
  }, [condition, selectedSize, currentVariants]);

  const formatIDR = (price: number) => new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    maximumFractionDigits: 0 
  }).format(price);

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{product.brand?.name}</span>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">{product.name}</h1>
        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-2">SKU: {product.SKU || "N/A"}</p>
      </div>

      {/* 🚀 UI HARGA DENGAN START FROM & SALE PRICE */}
      <div className="flex flex-col">
        {!selectedSize && (
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">
            Start from
          </span>
        )}
        <div className="flex items-baseline gap-3">
          {pricing.isVariant ? (
            <>
              {pricing.salePrice ? (
                <>
                  <span className="text-3xl font-black text-zinc-950 tracking-tighter">
                    {formatIDR(pricing.salePrice)}
                  </span>
                  <span className="text-sm font-medium text-zinc-400 line-through tracking-tight">
                    {formatIDR(pricing.regularPrice)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-zinc-950 tracking-tighter">
                  {formatIDR(pricing.regularPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-3xl font-black text-zinc-950 tracking-tighter">
              {formatIDR(pricing.minPrice)}
            </span>
          )}
        </div>
      </div>

      <Separator className="bg-zinc-100" />

      {/* CONDITION PICKER */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Condition</label>
        <div className="flex gap-2">
          <button 
            onClick={() => { setCondition("new"); setSelectedSize(null); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${condition === 'new' ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-400 hover:border-zinc-900'}`}
          >New</button>
          <button 
            onClick={() => { setCondition("used"); setSelectedSize(null); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${condition === 'used' ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-400 hover:border-zinc-900'}`}
          >Used</button>
        </div>
      </div>

      {/* SIZE PICKER */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Sizes</label>
        <div className="grid grid-cols-4 gap-2">
          {currentVariants.map((v: any) => (
            <button
              key={v.size}
              disabled={v.stock === 0}
              onClick={() => setSelectedSize(v.size)}
              className={`py-3 text-xs font-bold border transition-all disabled:opacity-30 rounded-none ${selectedSize === v.size ? 'bg-black text-white border-black' : 'border-zinc-100 hover:border-zinc-900'}`}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>

      {/* USED DETAILS BOX */}
      {condition === "used" && selectedSize && (
        <div className="p-4 bg-zinc-50 border border-zinc-100 space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase">
            <span className="text-zinc-400">Condition Score</span>
            <span className="text-orange-600">{currentVariants.find((v: any) => v.size === selectedSize)?.condition}</span>
          </div>
          <p className="text-[10px] leading-relaxed"><span className="font-bold uppercase text-zinc-400">Defects:</span> {currentVariants.find((v: any) => v.size === selectedSize)?.defects || "None"}</p>
        </div>
      )}

      <div className="pt-4 space-y-3">
        <Button className="w-full h-14 bg-zinc-950 text-white font-black uppercase tracking-widest hover:bg-zinc-800 rounded-none transition-all">Add to Cart</Button>
        <div className="flex items-center justify-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${product.stockStatus === 'instock' ? 'bg-green-500' : 'bg-red-500'}`} />
           <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{product.stockStatus === 'instock' ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
    </div>
  );
}