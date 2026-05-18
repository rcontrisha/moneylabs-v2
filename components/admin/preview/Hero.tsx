"use client";

import HeroSlider from '@/components/shared/hero-slider';

interface PreviewHeroProps {
  block: {
    id: string;
    payload: {
      images?: string[];
      image?: string;
      link?: string;
    };
  };
}

export function PreviewHero({ block }: PreviewHeroProps) {
  const imgs = block.payload.images ?? (block.payload.image ? [block.payload.image] : []);

  if (!imgs || imgs.length === 0) {
    return (
      <div className="w-full aspect-21/9 bg-zinc-900 flex items-center justify-center relative border-b border-zinc-800">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Hero Section</span>
      </div>
    );
  }

  const slides = imgs.map((src, i) => ({
    id: `${block.id}-${i}`,
    title: "",
    subtitle: null,
    image: src,
    ctaText: "",
    ctaLink: block.payload.link ?? "/shop",
  }));

  return (
    <div className="w-full relative border-b border-zinc-800">
      <HeroSlider data={slides} compact />
    </div>
  );
}
