"use client";

import React from "react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from 'next/image';

// Top-level Hero modal component (pure, receives state via props)
export function HeroModal({
  open,
  images,
  onChangeImage,
  onAddImage,
  onRemoveImage,
  onClose,
  onSave,
}: {
  open: boolean;
  images: string[];
  onChangeImage: (index: number, value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full p-6 rounded shadow-lg">
        <h3 className="text-lg font-black mb-4">Edit Hero Section</h3>
        <p className="text-sm text-zinc-500 mb-4">Add images for the hero carousel (first image used as fallback).</p>
        <div className="space-y-4 mb-4">
          {images.map((src, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 h-20 bg-zinc-50 rounded overflow-hidden border">
                {src ? (
                  // preview
                  <Image src={src} alt={`hero-${i}`} width={320} height={200} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">No image</div>
                )}
              </div>

              <div className="flex-1">
                {src ? (
                  <div className="flex items-center gap-2">
                    <div className="text-sm break-all">{src}</div>
                    <UploadDropzone<OurFileRouter, "sneakerImage">
                      endpoint="sneakerImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) onChangeImage(i, res[0].url);
                      }}
                      appearance={{
                        container: "inline-block",
                        label: "hidden",
                        button: "px-2 py-1 bg-zinc-900 text-white text-[11px] rounded"
                      }}
                    />
                    <button className="px-2 py-1 text-red-500" onClick={() => onRemoveImage(i)}>Remove</button>
                  </div>
                ) : (
                  <UploadDropzone<OurFileRouter, "sneakerImage">
                    endpoint="sneakerImage"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) onChangeImage(i, res[0].url);
                    }}
                    appearance={{
                      container: "w-full",
                      label: "hidden",
                      button: "px-3 py-1 bg-zinc-900 text-white text-[11px] rounded"
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          <div>
            <button className="px-3 py-1 border bg-zinc-50" onClick={onAddImage}>Add Image</button>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-black text-white" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
