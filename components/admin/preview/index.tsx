"use client";

import { PreviewHero } from './Hero';
import { PreviewProductCarousel } from './ProductCarousel';
import { PreviewFeaturedCategories } from './FeaturedCategories';
import { PreviewPromo } from './Promo';

type Block = {
  id: string;
  type: string;
  payload: any;
};

export function PreviewBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'hero':
      return <PreviewHero block={block} />;
    case 'product-carousel':
      return <PreviewProductCarousel block={block} />;
    case 'featured-categories':
      return <PreviewFeaturedCategories />;
    case 'promo':
      return <PreviewPromo block={block} />;
    default:
      return <div className="w-full py-6 text-center text-zinc-400">Unknown block: {block.type}</div>;
  }
}

export default PreviewBlock;
