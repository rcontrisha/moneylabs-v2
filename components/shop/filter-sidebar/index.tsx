"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Brand, Category } from "@prisma/client";
import PriceRangeSlider from "@/components/shop/price-range-slider";

interface FilterSidebarProps {
  brands: Brand[];
  categories: Category[];
  sizes: string[];
  maxPrice: number;
}

export default function FilterSidebar({ brands, categories, sizes, maxPrice }: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const buildParams = (
    key: string,
    value: string,
    multi: boolean = false,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (multi) {
      const existing = params.getAll(key);
      if (existing.includes(value)) {
        params.delete(key);
        existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    } else {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    return params.toString();
  };

  const pushParams = (key: string, value: string, multi: boolean = false) => {
    const qs = buildParams(key, value, multi);
    router.push(`?${qs}`, { scroll: false });
  };

  const activeBrands = searchParams.getAll("brand");
  const activeCategories = searchParams.getAll("category");
  const activeSizes = searchParams.getAll("size");
  const activeCondition = searchParams.getAll("condition");
  const inStock = searchParams.get("inStock") === "true";

  const sectionLabel = "text-[10px] font-bold uppercase tracking-widest text-black mb-2";

  const pillClass = (active: boolean) =>
    `text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border transition-colors ${
      active
        ? "bg-black text-white border-black"
        : "text-zinc-400 border-zinc-200 hover:border-zinc-400 hover:text-zinc-600"
    }`;

  const PillSection = ({
    title,
    items,
  }: {
    title: string;
    items: { key: string; label: string; active: boolean; onClick: () => void }[];
  }) => (
    <div className="pb-5 border-b border-zinc-100">
      <h3 className={sectionLabel}>{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button key={item.key} onClick={item.onClick} className={pillClass(item.active)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5 select-none">
      <h2 className="text-sm font-black uppercase tracking-widest text-black pb-3 border-b border-zinc-200">
        Filter
      </h2>

      <PillSection
        title="Brand"
        items={brands.map((b) => ({
          key: b.id,
          label: b.name,
          active: activeBrands.includes(b.slug),
          onClick: () => pushParams("brand", b.slug, true),
        }))}
      />

      <PillSection
        title="Category"
        items={categories.map((c) => ({
          key: c.id,
          label: c.name,
          active: activeCategories.includes(c.slug),
          onClick: () => pushParams("category", c.slug, true),
        }))}
      />

      <PillSection
        title="Size (US)"
        items={sizes.map((s) => ({
          key: s,
          label: s,
          active: activeSizes.includes(s),
          onClick: () => pushParams("size", s, true),
        }))}
      />

      <PillSection
        title="Condition"
        items={["new", "used"].map((cond) => ({
          key: cond,
          label: cond.charAt(0).toUpperCase() + cond.slice(1),
          active: activeCondition.includes(cond),
          onClick: () => pushParams("condition", cond, true),
        }))}
      />

      <PillSection
        title="Availability"
        items={[
          {
            key: "inStock",
            label: "In Stock Only",
            active: inStock,
            onClick: () => pushParams("inStock", "true"),
          },
        ]}
      />

      <div>
        <h3 className={sectionLabel}>Price Range</h3>
        <PriceRangeSlider maxPrice={maxPrice} />
      </div>
    </div>
  );
}
