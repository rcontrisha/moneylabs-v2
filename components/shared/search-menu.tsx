"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnClickOutside } from "@/lib/hooks/use-click-outside";

const popularSearches = [
  "Samba", "Cortez", "Gazelle", "Air Force", "Dunk",
  "Jordan", "Blazer", "Vomero", "Ultraboost",
];

const defaultCategories = [
  { name: "Sneakers", slug: "sneakers" },
  { name: "Boots", slug: "boots" },
  { name: "Slides", slug: "slides" },
  { name: "Running", slug: "running" },
  { name: "Basketball", slug: "basketball" },
  { name: "Lifestyle", slug: "lifestyle" },
];

const defaultBrands = [
  { name: "Nike", slug: "nike" },
  { name: "Adidas", slug: "adidas" },
  { name: "Puma", slug: "puma" },
  { name: "New Balance", slug: "new-balance" },
  { name: "Vans", slug: "vans" },
  { name: "Converse", slug: "converse" },
];

interface SearchMenuProps {
  categories?: { name: string; slug: string }[];
  brands?: { name: string; slug: string }[];
}

export default function SearchMenu({
  categories = defaultCategories,
  brands = defaultBrands,
}: SearchMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useOnClickOutside(ref, close, isOpen ? modalRef : undefined);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "Enter" && query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      close();
    }
  };

  const openAndFocus = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const tagClass =
    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-zinc-200 text-zinc-500 hover:border-black hover:text-black transition-colors";

  const sectionLabel =
    "text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2";

  return (
    <div ref={ref} className="relative">
      {/* Desktop Trigger — wider input-like button */}
      <button
        onClick={openAndFocus}
        className="hidden lg:flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-4 py-2 w-full text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:border-zinc-400 transition-colors"
      >
        <Search className="size-3.5 flex-shrink-0" />
        <span className="truncate">Search for brand and sneakers...</span>
      </button>

      {/* Mobile Trigger — compact icon */}
      <Button
        variant="ghost"
        size="icon"
        className="flex lg:hidden hover:bg-transparent hover:text-primary transition-colors"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
        }}
      >
        <Search className="size-5" />
      </Button>

      {isOpen && (
        <>
          {/* Desktop Overlay */}
          <div className="hidden sm:block absolute right-0 top-full mt-2 w-full max-w-[760px] bg-white border border-zinc-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 mb-3">
                <Search className="size-4 text-zinc-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for brand and sneakers..."
                  className="w-full bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none placeholder:text-zinc-300"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-zinc-400 hover:text-black flex-shrink-0"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {!query && (
                <>
                  <div className="mb-4">
                    <p className={sectionLabel}>Pencarian Populer</p>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((kw) => (
                        <Link
                          key={kw}
                          href={`/shop?q=${encodeURIComponent(kw)}`}
                          onClick={close}
                          className={tagClass}
                        >
                          {kw}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className={sectionLabel}>Kategori</p>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/shop?category=${c.slug}`}
                          onClick={close}
                          className={tagClass}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={sectionLabel}>Pilih Berdasarkan Merek</p>
                    <div className="flex flex-wrap gap-1.5">
                      {brands.map((b) => (
                        <Link
                          key={b.slug}
                          href={`/shop?brand=${b.slug}`}
                          onClick={close}
                          className={tagClass}
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {query && (
                <div className="text-center py-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Press Enter to search &quot;{query}&quot;
                  </p>
                  <Link
                    href={`/shop?q=${encodeURIComponent(query)}`}
                    onClick={close}
                    className="inline-block border border-zinc-300 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-black hover:text-black transition-colors"
                  >
                    Search
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Full-Screen Modal */}
              {createPortal(
                <div ref={modalRef} className={`sm:hidden fixed inset-0 z-50 bg-white transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-center gap-2 px-4 py-6 border-b border-zinc-200">
              <Search className="size-4 text-zinc-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search sneakers..."
                className="w-full bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none placeholder:text-zinc-300"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-zinc-400 hover:text-black flex-shrink-0"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                onClick={close}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black flex-shrink-0 ml-2"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {!query && (
                <>
                  <div className="mb-6">
                    <p className={sectionLabel}>Pencarian Populer</p>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((kw) => (
                        <Link
                          key={kw}
                          href={`/shop?q=${encodeURIComponent(kw)}`}
                          onClick={close}
                          className={tagClass}
                        >
                          {kw}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className={sectionLabel}>Kategori</p>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/shop?category=${c.slug}`}
                          onClick={close}
                          className={tagClass}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={sectionLabel}>Pilih Berdasarkan Merek</p>
                    <div className="flex flex-wrap gap-1.5">
                      {brands.map((b) => (
                        <Link
                          key={b.slug}
                          href={`/shop?brand=${b.slug}`}
                          onClick={close}
                          className={tagClass}
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {query && (
                <div className="text-center py-8">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Press Enter to search &quot;{query}&quot;
                  </p>
                  <Link
                    href={`/shop?q=${encodeURIComponent(query)}`}
                    onClick={close}
                    className="inline-block border border-zinc-300 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-black hover:text-black transition-colors"
                  >
                    Search
                  </Link>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
        </>
      )}
    </div>
  );
}
