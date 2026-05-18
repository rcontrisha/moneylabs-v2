"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockItem } from "./BlockItem";
import type { Block } from "@/types/landing";

const BLOCK_TYPES = ['hero', 'product-carousel', 'featured-categories', 'promo'];

type Props = {
  blocks: Block[];
  onAdd: (type: string) => void;
  onRemove: (id: string) => void;
  onEditHero: (block: Block) => void;
  onEditProduct: (block: Block) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
};

export function LibraryPanel({ blocks, onAdd, onRemove, onEditHero, onEditProduct, onDragStart, onDragOver, onDrop }: Props) {
  return (
    <div className="col-span-4 border-r border-zinc-100 p-10 bg-zinc-50/30 text-black">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black uppercase text-black tracking-[0.3em]">Library</h2>
          <Button variant="outline" size="sm" className="rounded-none border-lime-400 text-lime-600 text-[9px] font-black h-7" onClick={() => onAdd('hero')}>
            ADD SECTION +
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {BLOCK_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="p-4 bg-white border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black transition-all text-zinc-400 hover:text-black flex items-center gap-3"
            >
              <Plus size={12} /> {type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase text-zinc-300 tracking-widest mb-4">Active Layout Stack</h3>
        {blocks.map((b, idx) => (
          <BlockItem
            key={b.id}
            block={b}
            index={idx}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onRemove={onRemove}
            onEditHero={onEditHero}
            onEditProduct={onEditProduct}
          />
        ))}
      </div>
    </div>
  );
}
