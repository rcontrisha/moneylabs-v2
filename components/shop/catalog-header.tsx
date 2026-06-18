"use client";

export default function CatalogHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-y-6 md:gap-y-0 pb-6 border-b border-zinc-200 mb-6 select-none">
      <div className="flex flex-col flex-grow">
        {/* Aggressive Editorial Title */}
        <h1 className="font-black italic uppercase text-5xl md:text-6xl lg:text-7xl tracking-[-0.05em] text-black leading-[0.8] pr-4">
          SHOP ALL KICKS
        </h1>
      </div>

      {/* Anchor-Aligned Search Bar */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 ml-auto pt-4 md:pt-0 relative group">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase font-bold mb-1.5 flex items-center justify-between">
            <span>[ SEARCH_QUERY ]</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-emerald-500">SYS_SEARCHING_</span>
          </span>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="SEARCH SNEAKERS..."
              className="w-full bg-transparent border-b border-zinc-300 py-2 focus:outline-none focus:border-black transition-colors duration-300 font-bold text-xs lg:text-sm tracking-widest placeholder:text-zinc-300 uppercase focus:placeholder:text-zinc-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
