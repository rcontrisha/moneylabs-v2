"use client";

import { useState, useMemo } from "react";
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

export default function ProductForm({ brands, categories, initialData }: { brands: Brand[], categories: Category[], initialData?: any }) {
  // Initialize form state from initialData when editing, fallback to defaults for create
  const [images, setImages] = useState<(string | null)[]>(() => {
    // DB stores main cover in `product.image` and the gallery in `product.images` (comma-separated)
    const imgsField = initialData?.images ? String(initialData.images).split(',').filter(Boolean) : [];
    // prefer explicit main cover field, otherwise take first from imgsField
    const main = initialData?.image || imgsField.shift() || null;
    return [
      main,
      imgsField[0] || null,
      imgsField[1] || null,
      imgsField[2] || null,
    ];
  }); 
  const [isFeatured, setIsFeatured] = useState<boolean>(() => !!initialData?.featured);
  // keep SKU coming from initialData when editing; otherwise we'll derive one for create
  const [productName, setProductName] = useState<string>(() => initialData?.name || "");
  const [selectedBrandId, setSelectedBrandId] = useState<string>(() => initialData?.brandId || "");
  type SizeVariant = { size: string; regularPrice: number; salePrice: number | null; stock: number };

  const [sizes, setSizes] = useState<{ new: SizeVariant[]; used: SizeVariant[] }>(() => {
    if (initialData?.sizes) {
      try {
        return typeof initialData.sizes === 'string' ? JSON.parse(initialData.sizes) : initialData.sizes;
      } catch {
        return { new: [], used: [] };
      }
    }
    return { new: [{ size: "40", regularPrice: 0, salePrice: null, stock: 5 }], used: [] };
  });

  // 🚀 DERIVED SKU (computed when creating; keep existing SKU when editing)
  // Use a pure deterministic suffix function to avoid impure calls in render.
  const deterministicSuffix = (input: string) => {
    let n = 0;
    for (let i = 0; i < input.length; i++) {
      n = (n * 31 + input.charCodeAt(i)) | 0;
    }
    const s = Math.abs(n).toString(36).toUpperCase();
    return s.slice(-4).padStart(4, "0");
  };

  const generatedSku = useMemo(() => {
    if (!productName) return "";
    const brand = brands.find(b => b.id === selectedBrandId)?.name || "ML";
    const nameSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .split('-')
      .filter(Boolean)
      .slice(0, 2)
      .join('-')
      .toUpperCase();

    const suffix = deterministicSuffix(`${brand}-${nameSlug}`);
    return `${brand.substring(0, 3).toUpperCase()}-${nameSlug}-${suffix}`;
  }, [productName, selectedBrandId, brands]);

  const displayedSku = initialData?.SKU || generatedSku;

  // AUTOMATIC QUANTITY CALCULATION
  const totalQuantity = useMemo(() => {
    const newStock = sizes.new.reduce((acc: number, curr: SizeVariant) => acc + (Number(curr.stock) || 0), 0);
    const usedStock = sizes.used.reduce((acc: number, curr: SizeVariant) => acc + (Number(curr.stock) || 0), 0);
    return newStock + usedStock;
  }, [sizes]);

  const handleSetImage = (url: string | null, index: number) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  // If initialData is provided, we still submit to the same server action but the server
  // action must distinguish create vs update (we will include a hidden `productId` when editing).
  return (
    <form action={createProduct} className="grid grid-cols-1 gap-8 lg:grid-cols-12 w-full">
      <div className="lg:col-span-7 space-y-6">
        <GeneralInfo 
          brands={brands} 
          categories={categories} 
          sku={displayedSku}
          onNameChange={setProductName}
          onBrandChange={setSelectedBrandId}
          nameDefault={initialData?.name}
          brandDefault={initialData?.brandId}
          categoryDefault={initialData?.categoryId}
          shortDescDefault={initialData?.shortDesc}
        />
        
        <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm space-y-4">
          <Label className="text-[11px] font-bold text-zinc-500 uppercase">Product Description</Label>
          <Textarea 
            name="description" 
            placeholder="Detailed product specifications..." 
            defaultValue={initialData?.description || ''}
            className="min-h-50 border-zinc-200 text-sm focus-visible:ring-zinc-950"
          />
        </div>

  <VariantSection type="new" data={sizes.new} onChange={(val: SizeVariant[]) => setSizes({ ...sizes, new: val })} />
  <VariantSection type="used" data={sizes.used} onChange={(val: SizeVariant[]) => setSizes({ ...sizes, used: val })} />
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
            {initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>

  <input type="hidden" name="image" value={images[0] || ""} />
  <input type="hidden" name="images" value={images.slice(1).filter(Boolean).join(',')} />
  <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />
  <input type="hidden" name="featured" value={isFeatured ? "true" : "false"} />
  <input type="hidden" name="quantity" value={totalQuantity} />
  <input type="hidden" name="SKU" value={displayedSku} /> {/* 🚀 SKU otomatis dikirim */}
  {initialData?.id && <input type="hidden" name="productId" value={initialData.id} />}
    </form>
  );
}