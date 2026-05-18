"use client";

export function PreviewFeaturedCategories() {
  return (
    <div className="grid grid-cols-2 gap-6 bg-zinc-100 border-b border-zinc-100 px-4 py-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="aspect-video bg-white flex items-center justify-center text-[10px] text-zinc-200 uppercase font-black italic tracking-[0.5em]">
          CAT_0{i}
        </div>
      ))}
    </div>
  );
}
