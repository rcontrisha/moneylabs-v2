"use client";

import { GripVertical, Trash2, Pencil } from "lucide-react";
import type { Block } from "@/types/landing";

type Props = {
  block: Block;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onRemove: (id: string) => void;
  onEditHero?: (block: Block) => void;
  onEditProduct?: (block: Block) => void;
};

export function BlockItem({ block, index, onDragStart, onDragOver, onDrop, onRemove, onEditHero, onEditProduct }: Props) {
  return (
    <div
      key={block.id}
      draggable
      onDragStart={e => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={e => onDrop(e, index)}
      className="bg-white border border-zinc-100 hover:border-zinc-300 p-5 group transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="cursor-grab text-zinc-200 group-hover:text-black transition-colors">
            <GripVertical size={16} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-black">{block.type.replace('-', ' ')}</div>
            <div className="text-[8px] font-mono text-zinc-400">ID_{block.id.toUpperCase()}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {block.type === 'hero' && onEditHero && (
            <button className="p-2 text-zinc-400 hover:text-black" onClick={() => onEditHero(block)}>
              <Pencil size={14} />
            </button>
          )}
          {block.type === 'product-carousel' && onEditProduct && (
            <button className="p-2 text-zinc-400 hover:text-black" onClick={() => onEditProduct(block)} title="Edit carousel">
              <Pencil size={14} />
            </button>
          )}
          <button onClick={() => onRemove(block.id)} className="p-2 text-zinc-400 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
