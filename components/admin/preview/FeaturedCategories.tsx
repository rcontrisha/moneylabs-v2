"use client";

export function PreviewFeaturedCategories() {
  return (
    <div className="grid grid-cols-4 gap-6 bg-zinc-100 border-b border-zinc-100 px-4 py-6">
      {[1, 2, 3, 4].map(i => (
        // 👟 OPTIMALISASI: Mengubah aspect-video menjadi aspect-[3/4] biar bentuk card-nya vertikal menyerupai web aslinya
        <div key={i} className="aspect-[3/4] bg-white flex items-center justify-center text-[10px] text-zinc-300 uppercase font-black italic tracking-[0.5em] border border-zinc-200/60 shadow-sm rounded-sm">
          CAT_0{i}
        </div>
      ))}
    </div>
  );
}