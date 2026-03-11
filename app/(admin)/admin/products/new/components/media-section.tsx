"use client";

import Image from "next/image";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { deleteFileFromUT } from "@/lib/actions/uploadthing"; 
import { useState } from "react";

interface MediaSectionProps {
  images: (string | null)[];
  onSetImage: (url: string | null, index: number) => void;
}

export function MediaSection({ images, onSetImage }: MediaSectionProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (url: string, index: number) => {
    setIsDeleting(index);
    // Hapus di server UploadThing dulu wir biar kuota balik
    const res = await deleteFileFromUT(url);
    
    if (res?.success) {
      // Baru hapus di UI
      onSetImage(null, index);
    }
    setIsDeleting(null);
  };

  const ImageSlot = ({ index, label, isLarge = false }: { index: number, label: string, isLarge?: boolean }) => {
    const currentImage = images[index];

    return (
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <div className={`relative overflow-hidden rounded-xl border-2 border-dashed border-zinc-100 bg-zinc-50 transition-all ${isLarge ? 'aspect-video' : 'aspect-square'}`}>
          {currentImage ? (
            <>
              <Image src={currentImage} alt={label} fill className="object-contain p-4" />
              <button 
                type="button"
                disabled={isDeleting === index}
                onClick={() => handleDelete(currentImage, index)}
                className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm text-zinc-600 p-1.5 rounded-lg shadow-sm border border-zinc-200 hover:text-red-600 transition-all disabled:opacity-50"
              >
                {isDeleting === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </button>
              {index === 0 && <Badge className="absolute bottom-3 left-3 bg-zinc-900 text-white text-[10px] uppercase font-bold px-2 py-0.5">Main Cover</Badge>}
            </>
          ) : (
            <UploadDropzone<OurFileRouter, "sneakerImage">
              endpoint="sneakerImage"
              onClientUploadComplete={(res) => onSetImage(res[0].url, index)}
              appearance={{
                container: "h-full border-none p-0 m-0 bg-transparent flex flex-col items-center justify-center cursor-pointer",
                label: "hidden",
                allowedContent: "hidden",
                button: "bg-zinc-900 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg h-auto mt-2 shadow-sm",
              }}
              content={{
                uploadIcon: <UploadCloud className="h-6 w-6 text-zinc-400" />,
                label: "Drop file here",
                button: "Choose"
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-6 shadow-sm space-y-6">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Product Media</h2>
        <p className="text-[11px] text-zinc-400 font-medium">Manage your photos. Removing an image will free up your storage quota.</p>
      </div>
      <div className="space-y-6">
        <ImageSlot index={0} label="Cover Image" isLarge />
        <div className="grid grid-cols-3 gap-4">
          <ImageSlot index={1} label="Lateral" />
          <ImageSlot index={2} label="Outsole" />
          <ImageSlot index={3} label="Detail" />
        </div>
      </div>
    </div>
  );
}