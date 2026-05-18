"use client";

import Image from 'next/image';

interface PreviewPromoProps {
  block: {
    payload: {
      image?: string;
    };
  };
}

export function PreviewPromo({ block }: PreviewPromoProps) {
  return (
    <div className="w-full aspect-6/2 bg-zinc-50 flex items-center justify-center relative border-b border-zinc-100">
      {block.payload.image ? (
        <Image src={block.payload.image} alt="promo" fill className="object-cover" />
      ) : (
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Promo Banner</div>
      )}
    </div>
  );
}
