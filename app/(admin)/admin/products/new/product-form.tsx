"use client";

import { useState, useMemo, useEffect } from "react";
import { Brand, Category } from "@prisma/client";
import { createProduct } from "@/lib/actions/product";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { GeneralInfo } from "./components/general-info";
import { VariantSection } from "./components/variant-section";
import { MediaSection } from "./components/media-section";

export default function ProductForm({ brands, categories }: { brands: Brand[], categories: Category[] }) {
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]); 
  const [isFeatured, setIsFeatured] = useState(false);
  const [sku, setSku] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [sizes, setSizes] = useState({ 
    new: [{ size: "40", regularPrice: 0, salePrice: null, stock: 5 }], 
    used: [] 
  });

  // 🚀 AUTOMATIC SKU GENERATION
  useEffect(() => {
    if (!productName) {
      setSku("");
      return;
    }

    const brand = brands.find(b => b.id === selectedBrandId)?.name || "ML";
    const nameSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .split('-')
      .filter(Boolean)
      .slice(0, 2)
      .join('-')
      .toUpperCase();
    
    // Format: BRAND-NAME-RANDOM (4 digit)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setSku(`${brand.substring(0, 3).toUpperCase()}-${nameSlug}-${randomSuffix}`);
  }, [productName, selectedBrandId, brands]);

  // AUTOMATIC QUANTITY CALCULATION
  const totalQuantity = useMemo(() => {
    const newStock = sizes.new.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
    const usedStock = sizes.used.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
    return newStock + usedStock;
  }, [sizes]);

  const handleSetImage = (url: string | null, index: number) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  return (
    <form action={createProduct} className="grid grid-cols-1 gap-8 lg:grid-cols-12 w-full">
      <div className="lg:col-span-7 space-y-6">
        <GeneralInfo 
          brands={brands} 
          categories={categories} 
          sku={sku} 
          onNameChange={setProductName}
          onBrandChange={setSelectedBrandId}
        />
        
        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm space-y-4">
          <Label className="text-[11px] font-bold text-zinc-500 uppercase">Product Description</Label>
          <Textarea 
            name="description" 
            placeholder="Detailed product specifications..." 
            className="min-h-[200px] border-zinc-200 text-sm focus-visible:ring-zinc-950"
          />
        </div>

        <VariantSection type="new" data={sizes.new} onChange={(val: any) => setSizes({ ...sizes, new: val })} />
        <VariantSection type="used" data={sizes.used} onChange={(val: any) => setSizes({ ...sizes, used: val })} />
      </div>

      <div className="lg:col-span-5 space-y-6">
        <MediaSection images={images} onSetImage={handleSetImage} />

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Calculated Stock</span>
            <span className="text-sm font-black text-zinc-900">{totalQuantity} Pairs</span>
          </div>

          <div className="flex items-center space-x-3 rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
            <Checkbox id="featured" checked={isFeatured} onCheckedChange={(val) => setIsFeatured(!!val)} />
            <Label htmlFor="featured" className="text-sm font-medium cursor-pointer text-zinc-600">
              Set as <span className="font-semibold text-zinc-900 uppercase text-[11px]">Featured Drops</span>
            </Label>
          </div>

          <Separator className="bg-zinc-100" />
          
          <Button type="submit" className="w-full h-12 bg-zinc-950 font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-all rounded-lg shadow-lg">
            Create Product
          </Button>
        </div>
      </div>

      <input type="hidden" name="image" value={images[0] || ""} />
      <input type="hidden" name="images" value={images.slice(1).filter(Boolean).join(',')} />
      <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />
      <input type="hidden" name="featured" value={isFeatured ? "true" : "false"} />
      <input type="hidden" name="quantity" value={totalQuantity} />
      <input type="hidden" name="SKU" value={sku} /> {/* 🚀 SKU otomatis dikirim */}
    </form>
  );
}