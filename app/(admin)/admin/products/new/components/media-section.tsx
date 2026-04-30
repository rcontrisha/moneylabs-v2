// app/(admin)/admin/products/new/components/media-section.tsx
"use client";

import Image from "next/image";
import { X, UploadCloud, Loader2 } from "lucide-react"; // Tambah Loader2
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { cn } from "@/lib/utils";

interface MediaSectionProps {
  images: (string | null)[];
  onSetImage: (url: string | null, index: number) => void;
}

export function MediaSection({ images, onSetImage }: MediaSectionProps) {
  // State buat mantau slot mana yang lagi proses hapus background
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);

  const ImageSlot = ({ index, label, isLarge = false }: { index: number, label: string, isLarge?: boolean }) => {
    const currentImage = images[index];
    const isThisSlotProcessing = processingIndex === index;

    return (
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <div className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed border-zinc-100 transition-all aspect-square",
          isLarge && "aspect-video",
          // Kasih visual bg putih biar keliatan kalau udah transparan wir
          currentImage || isThisSlotProcessing ? "bg-white" : "bg-zinc-50 hover:bg-zinc-100/50" 
        )}>
          {/* ⏳ JIKA LAGI PROSES HAPUS BG */}
          {isThisSlotProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20 bg-white/90 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-950" />
              <span className="text-[10px] font-bold uppercase text-zinc-500">Removing BG...</span>
            </div>
          )}

          {currentImage ? (
            <>
              {/* object-contain p-4 biar sepatunya gak kepotong wir */}
              <Image src={currentImage} alt={label} fill className="object-contain p-4 transition-all" />
              <button 
                type="button"
                onClick={() => onSetImage(null, index)}
                className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm text-zinc-600 p-1.5 rounded-lg shadow-sm border border-zinc-200 hover:text-red-600 transition-all z-10"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && <Badge className="absolute bottom-3 left-3 bg-zinc-900 text-white text-[10px] uppercase font-bold px-2 py-0.5 z-10">Main Cover</Badge>}
            </>
          ) : !isThisSlotProcessing && (
            <UploadDropzone<OurFileRouter, "sneakerImage">
              endpoint="sneakerImage"
              // 🚀 LOGIC SAKTI: Hapus Background Sebelum Upload
              onBeforeUploadBegin={async (files) => {
                setProcessingIndex(index); // Mulai loading di slot ini
                
                try {
                  const file = files[0];
                  console.log(`Processing background removal for: ${file.name}`);
                  
                  // 1. Panggil fungsi sakti hapus BG
                  const blob = await removeBackground(file);
                  
                  // 2. Ubah Blob balik jadi File biar UploadThing seneng
                  const newFileName = file.name.replace(/\.[^/.]+$/, "") + "-transparent.png";
                  const transparentFile = new File([blob], newFileName, { type: "image/png" });
                  
                  console.log("Background removal success wir!");
                  setProcessingIndex(null); // Matikan loading
                  return [transparentFile]; // Kirim file yang udah bersih ke UploadThing
                  
                } catch (error) {
                  console.error("Gagal hapus background wir:", error);
                  setProcessingIndex(null); // Matikan loading kalau gagal
                  return files; // Kalau gagal, upload mentahannya aja biar gak stuck
                }
              }}
              onClientUploadComplete={(res) => {
                onSetImage(res[0].url, index); // Simpen URL transparan ke state utama
              }}
              appearance={{
                container: "h-full border-none p-0 m-0 bg-transparent flex flex-col items-center justify-center cursor-pointer",
                label: "hidden",
                allowedContent: "hidden",
                button: cn(
                  "bg-zinc-900 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg h-auto mt-2 shadow-sm transition-all",
                  "ut-uploading:bg-zinc-400 ut-ready:bg-zinc-950"
                ),
              }}
              content={{
                uploadIcon: <UploadCloud className="h-6 w-6 text-zinc-400" />,
                label: "Drop or click",
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
        <p className="text-[11px] text-zinc-400 font-medium">Upload studio shots. Grey backgrounds will be automatically removed for a minimalist look.</p>
      </div>
      
      <div className="space-y-6 relative">
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