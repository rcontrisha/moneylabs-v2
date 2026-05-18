"use client";

import Image from 'next/image';
import { ChevronRight } from "lucide-react";

interface PreviewProductCarouselProps {
  block: {
    payload: {
      name?: string;
      params?: any;
    };
  };
}

export function PreviewProductCarousel({ block }: PreviewProductCarouselProps) {
  const items: { image?: string; title?: string; brand?: string; price?: string }[] =
    ((block.payload.params as any)?.items) ?? [];

  const renderItems = items.length > 0 ? items : Array.from({ length: 5 }).map((_, i) => ({
    image: `/assets/product-${(i % 5) + 1}.jpg`,
    title: `Product ${(i + 1)}`,
    brand: ['JORDAN', 'CONVERSE', 'VANS', 'REEBOK', 'NEW BALANCE'][i % 5],
    price: 'Rp 1.200.000'
  }));

  return (
    <div className="w-full py-8 px-10 bg-white border-b border-zinc-100">
      <div className="flex justify-between items-center mb-8 text-black">
        <h2 className="text-sm font-black italic border-l-4 border-lime-400 pl-4 uppercase tracking-tighter">
          {block.payload.name || 'FEATURED DROPS'}
        </h2>
        <ChevronRight size={16} className="text-zinc-300" />
      </div>
      <div className="grid grid-cols-5 gap-4">
        {renderItems.map((it, idx) => (
          <div key={idx} className="bg-white border p-3">
            <div className="aspect-[4/3] bg-zinc-50 mb-3 overflow-hidden flex items-center justify-center">
              {it.image ? (
                <Image src={it.image} alt={it.title ?? 'Product'} width={600} height={450} className="object-contain" />
              ) : (
                <div className="w-full h-full bg-zinc-100" />
              )}
            </div>
            <div className="text-[10px] text-zinc-400">{it.brand}</div>
            <div className="font-black text-sm uppercase text-black">{it.title}</div>
            <div className="text-sm font-bold mt-2 text-black">{it.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
