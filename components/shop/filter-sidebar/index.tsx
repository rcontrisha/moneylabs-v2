"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Brand, Category } from "@prisma/client";
import PriceRangeSlider from "@/components/shop/price-range-slider";

interface FilterSidebarProps {
  brands: Brand[];
  categories: Category[];
  maxPrice: number;
}

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" className="w-full h-full text-white" fill="none">
    <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default function FilterSidebar({ brands, categories, maxPrice }: FilterSidebarProps) {
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
  const activeCondition = searchParams.getAll("condition");
  const inStock = searchParams.get("inStock") === "true";

  const sectionLabel = "text-[10px] font-bold uppercase tracking-widest text-black mb-3";

  const checkboxBox = (checked: boolean) =>
    `flex-shrink-0 w-3.5 h-3.5 border transition-colors ${checked ? "bg-black border-black" : "border-zinc-300 group-hover:border-zinc-500"}`;

  const checkboxLabel = (checked: boolean) =>
    `text-xs font-bold uppercase tracking-wider ${checked ? "text-black" : "text-zinc-400 group-hover:text-zinc-600"} transition-colors`;

  return (
    <div className="space-y-6 select-none">
      <h2 className="text-sm font-black uppercase tracking-widest text-black pb-3 border-b border-zinc-200">
        Filter
      </h2>

      {/* BRAND */}
      <div className="pb-6 border-b border-zinc-100">
        <h3 className={sectionLabel}>Brand</h3>
        <div className="flex flex-col">
          {brands.map((brand) => {
            const checked = activeBrands.includes(brand.slug);
            return (
              <button
                key={brand.id}
                onClick={() => pushParams("brand", brand.slug, true)}
                className="flex items-center gap-2.5 group py-1 w-full text-left"
              >
                <span className={checkboxBox(checked)}>
                  {checked && <CheckIcon />}
                </span>
                <span className={checkboxLabel(checked)}>{brand.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="pb-6 border-b border-zinc-100">
        <h3 className={sectionLabel}>Category</h3>
        <div className="flex flex-col">
          {categories.map((cat) => {
            const checked = activeCategories.includes(cat.slug);
            return (
              <button
                key={cat.id}
                onClick={() => pushParams("category", cat.slug, true)}
                className="flex items-center gap-2.5 group py-1 w-full text-left"
              >
                <span className={checkboxBox(checked)}>
                  {checked && <CheckIcon />}
                </span>
                <span className={checkboxLabel(checked)}>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONDITION */}
      <div className="pb-6 border-b border-zinc-100">
        <h3 className={sectionLabel}>Condition</h3>
        <div className="flex flex-col">
          {["new", "used"].map((cond) => {
            const checked = activeCondition.includes(cond);
            return (
              <button
                key={cond}
                onClick={() => pushParams("condition", cond, true)}
                className="flex items-center gap-2.5 group py-1 w-full text-left"
              >
                <span className={checkboxBox(checked)}>
                  {checked && <CheckIcon />}
                </span>
                <span className={checkboxLabel(checked)}>
                  {cond.charAt(0).toUpperCase() + cond.slice(1)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STOCK */}
      <div className="pb-6 border-b border-zinc-100">
        <h3 className={sectionLabel}>Availability</h3>
        <div className="flex flex-col">
          <button
            key="inStock"
            onClick={() => pushParams("inStock", "true")}
            className="flex items-center gap-2.5 group py-1 w-full text-left"
          >
            <span className={checkboxBox(inStock)}>
              {inStock && <CheckIcon />}
            </span>
            <span className={checkboxLabel(inStock)}>In Stock Only</span>
          </button>
        </div>
      </div>

      {/* PRICE RANGE */}
      <div>
        <h3 className={sectionLabel}>Price Range</h3>
        <PriceRangeSlider maxPrice={maxPrice} />
      </div>
    </div>
  );
}
