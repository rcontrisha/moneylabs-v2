"use client";

import { useSearchParams, useRouter } from "next/navigation";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortDropdown() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSort = searchParams.get("sort") || "latest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative flex-shrink-0">
      <select
        className="border border-zinc-200 bg-white pl-3 pr-8 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
        value={activeSort}
        onChange={(e) => handleChange(e.target.value)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-zinc-400 text-xs">↓</span>
      </div>
    </div>
  );
}
