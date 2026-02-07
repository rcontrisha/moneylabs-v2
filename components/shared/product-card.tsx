// components/shared/product-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, Brand, Category } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  data: Product & {
    brand: Brand | null;
    category: Category | null;
  };
}

export default function ProductCard({ data }: ProductCardProps) {
  // Helper buat format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
    
  };

  // Hitung diskon kalau ada salePrice
  const hasDiscount = data.salePrice && Number(data.salePrice) < Number(data.regularPrice);
  const discountPercentage = hasDiscount
    ? Math.round(((Number(data.regularPrice) - Number(data.salePrice)) / Number(data.regularPrice)) * 100)
    : 0;

  return (
    <Card className="group relative overflow-hidden rounded-lg border-none bg-white shadow-sm transition-all hover:shadow-lg">
      {/* 1. Gambar Produk */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Badge Diskon (Kalo ada) */}
        {hasDiscount && (
          <Badge className="absolute left-2 top-2 z-10 bg-red-500 text-white hover:bg-red-600">
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Badge Stok (Kalo abis) */}
        {data.stockStatus === 'outofstock' && (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
             <span className="font-bold text-white uppercase tracking-widest">Sold Out</span>
           </div>
        )}

        <Link href={`/product/${data.slug}`}>
          <Image
            src={data.image || "/assets/placeholder.jpg"}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Tombol Add to Cart (Muncul pas hover doang) */}
        <div className="absolute bottom-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
           <Button size="icon" className="rounded-full shadow-md" disabled={data.stockStatus === 'outofstock'}>
              <ShoppingCart className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* 2. Info Produk */}
      <CardContent className="p-4">
        {/* Kategori & Brand Kecil */}
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-wider font-bold">{data.brand?.name}</span>
          <span>•</span>
          <span>{data.category?.name}</span>
        </div>

        {/* Judul Produk */}
        <Link href={`/product/${data.slug}`}>
          <h3 className="line-clamp-1 text-lg font-bold uppercase text-black transition-colors group-hover:text-primary">
            {data.name}
          </h3>
        </Link>
      </CardContent>

      {/* 3. Harga */}
      <CardFooter className="flex flex-col items-start gap-1 p-4 pt-0">
        {hasDiscount ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-600">
              {formatRupiah(Number(data.salePrice))}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatRupiah(Number(data.regularPrice))}
            </span>
          </div>
        ) : (
          <span className="text-lg font-bold text-black">
            {formatRupiah(Number(data.regularPrice))}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}