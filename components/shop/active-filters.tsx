"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Brand, Category } from "@prisma/client";

interface ActiveFiltersProps {
  brands: Brand[];
  categories: Category[];
}

const SORT_LABELS: Record<string, string> = {
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export default function ActiveFilters({ brands, categories }: ActiveFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeBrands = searchParams.getAll("brand");
  const activeCategories = searchParams.getAll("category");
  const activeCondition = searchParams.getAll("condition");
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  const chips: { key: string; label: string }[] = [];

  activeBrands.forEach((slug) => {
    const brand = brands.find((b) => b.slug === slug);
    if (brand) chips.push({ key: `brand-${slug}`, label: brand.name });
  });

  activeCategories.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) chips.push({ key: `category-${slug}`, label: cat.name });
  });

  activeCondition.forEach((c) => {
    chips.push({ key: `condition-${c}`, label: c.charAt(0).toUpperCase() + c.slice(1) });
  });

  if (inStock) {
    chips.push({ key: "inStock", label: "In Stock" });
  }

  if (minPrice || maxPrice) {
    const label = minPrice && maxPrice
      ? `Rp ${Number(minPrice).toLocaleString("id-ID")} — Rp ${Number(maxPrice).toLocaleString("id-ID")}`
      : minPrice
        ? `≥ Rp ${Number(minPrice).toLocaleString("id-ID")}`
        : `≤ Rp ${Number(maxPrice).toLocaleString("id-ID")}`;
    chips.push({ key: "price", label });
  }

  if (sort && sort !== "latest" && SORT_LABELS[sort]) {
    chips.push({ key: "sort", label: SORT_LABELS[sort] });
  }

  if (chips.length === 0) return null;

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key.startsWith("brand-")) {
      const slug = key.replace("brand-", "");
      const curr = params.getAll("brand").filter((v) => v !== slug);
      params.delete("brand");
      curr.forEach((v) => params.append("brand", v));
    } else if (key.startsWith("category-")) {
      const slug = key.replace("category-", "");
      const curr = params.getAll("category").filter((v) => v !== slug);
      params.delete("category");
      curr.forEach((v) => params.append("category", v));
    } else if (key.startsWith("condition-")) {
      const cond = key.replace("condition-", "");
      const curr = params.getAll("condition").filter((v) => v !== cond);
      params.delete("condition");
      curr.forEach((v) => params.append("condition", v));
    } else if (key === "inStock") {
      params.delete("inStock");
    } else if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else if (key === "sort") {
      params.delete("sort");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetAll = () => {
    router.push("?", { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeParam(chip.key)}
          className="inline-flex items-center gap-1.5 border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 hover:border-black hover:text-black transition-colors"
        >
          {chip.label}
          <span className="text-zinc-400 text-xs leading-none">×</span>
        </button>
      ))}
      <button
        onClick={resetAll}
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors ml-1"
      >
        Reset All
      </button>
    </div>
  );
}
