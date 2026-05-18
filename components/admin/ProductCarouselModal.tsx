"use client";

import React from "react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from 'next/image';

// Top-level Product Carousel modal
export function ProductCarouselModal({
  open,
  items,
  name,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  onChangeName,
  onClose,
  onSave,
}: {
  open: boolean;
  items: { image?: string; title?: string; brand?: string; price?: string }[];
  name?: string;
  onChangeItem: (index: number, patch: Partial<{ image?: string; title?: string; brand?: string; price?: string }>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onChangeName: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full p-6 rounded shadow-lg">
        <h3 className="text-lg font-black mb-2">Edit Product Carousel</h3>
        <p className="text-sm text-zinc-500 mb-4">Configure products shown in this carousel.</p>

        <div className="mb-4">
          <label className="text-xs font-bold uppercase text-zinc-500">Section Title</label>
          <input className="w-full border px-3 py-2 mt-2" value={name ?? ''} onChange={e => onChangeName(e.target.value)} />
        </div>

        <div className="space-y-3 max-h-[48vh] overflow-auto mb-4">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border rounded">
              <div className="w-20 h-20 bg-zinc-50 rounded overflow-hidden flex items-center justify-center">
                {it.image ? (
                  <Image src={it.image} alt={`p-${idx}`} width={160} height={160} className="object-cover" />
                ) : (
                  <div className="text-xs text-zinc-400">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="mb-2">
                  <input className="w-full border px-2 py-1 text-sm" placeholder="Title" value={it.title ?? ''} onChange={e => onChangeItem(idx, { title: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 border px-2 py-1 text-sm" placeholder="Brand" value={it.brand ?? ''} onChange={e => onChangeItem(idx, { brand: e.target.value })} />
                  <input className="w-28 border px-2 py-1 text-sm" placeholder="Price" value={it.price ?? ''} onChange={e => onChangeItem(idx, { price: e.target.value })} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <UploadDropzone<OurFileRouter, "sneakerImage">
                  endpoint="sneakerImage"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) onChangeItem(idx, { image: res[0].url });
                  }}
                  appearance={{ container: 'inline-block', label: 'hidden', button: 'px-2 py-1 bg-zinc-900 text-white text-[11px] rounded' }}
                />
                <button className="text-sm text-red-500" onClick={() => onRemoveItem(idx)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button className="px-3 py-1 border" onClick={onAddItem}>Add Product</button>
          <div className="flex gap-3">
            <button className="px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="px-4 py-2 bg-black text-white" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
