import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import FilterSidebar from "@/components/shop/filter-sidebar";
import ActiveFilters from "@/components/shop/active-filters";
import FilterDrawer from "@/components/shop/filter-drawer";
import SortDropdown from "@/components/shop/sort-dropdown";
import { prisma } from "@/lib/prisma";
import { Product, Brand, Category } from "@prisma/client";
import type { Prisma } from "@prisma/client";

type ProductWithRelations = Product & {
  brand: Brand | null;
  category: Category | null;
};

interface SizeVariant {
  size: string;
  regularPrice: number;
  salePrice: number | null;
  stock: number;
}

interface ProductSizes {
  new: SizeVariant[];
  used: (SizeVariant & { condition: string })[];
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

const getPricingInfo = (sizes: ProductSizes | null) => {
  if (!sizes) return { minPrice: 0, hasDiscount: false, regularPrice: 0 };
  const allVariants = [...(sizes.new || []), ...(sizes.used || [])];
  if (allVariants.length === 0) return { minPrice: 0, hasDiscount: false, regularPrice: 0 };

  let minEffective = Infinity;
  let regularPrice = 0;

  for (const v of allVariants) {
    const effective = v.salePrice ?? v.regularPrice;
    if (effective < minEffective) {
      minEffective = effective;
      regularPrice = v.regularPrice;
    }
  }

  return {
    minPrice: minEffective,
    regularPrice,
    hasDiscount: allVariants.some((v) => v.salePrice !== null),
  };
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const brandSlugs = sp.brand
    ? Array.isArray(sp.brand)
      ? sp.brand
      : [sp.brand]
    : [];
  const categorySlugs = sp.category
    ? Array.isArray(sp.category)
      ? sp.category
      : [sp.category]
    : [];
  const conditionFilter = sp.condition
    ? Array.isArray(sp.condition)
      ? sp.condition
      : [sp.condition]
    : [];
  const inStockOnly = sp.inStock === "true";
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;
  const sort = (sp.sort as string) || "latest";

  const where: Prisma.ProductWhereInput = {};
  if (brandSlugs.length > 0) {
    where.brand = { slug: { in: brandSlugs } };
  }
  if (categorySlugs.length > 0) {
    where.category = { slug: { in: categorySlugs } };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    { createdAt: "desc" };

  const [rawProducts, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy,
    }),
    prisma.brand.findMany(),
    prisma.category.findMany(),
  ]);

  let products = rawProducts as ProductWithRelations[];

  let overallMaxPrice = 0;
  for (const p of rawProducts) {
    const sizes = p.sizes as unknown as ProductSizes | null;
    const variants = [...(sizes?.new || []), ...(sizes?.used || [])];
    for (const v of variants) {
      if (v.regularPrice > overallMaxPrice) overallMaxPrice = v.regularPrice;
    }
  }
  overallMaxPrice = overallMaxPrice || 10_000_000;

  if (conditionFilter.length > 0) {
    products = products.filter((p) => {
      const sizes = p.sizes as unknown as ProductSizes | null;
      const hasNew = (sizes?.new?.length ?? 0) > 0;
      const hasUsed = (sizes?.used?.length ?? 0) > 0;
      return (
        (conditionFilter.includes("new") && hasNew) ||
        (conditionFilter.includes("used") && hasUsed)
      );
    });
  }

  if (inStockOnly) {
    products = products.filter((p) => p.stockStatus === "instock");
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    products = products.filter((p) => {
      const sizes = p.sizes as unknown as ProductSizes | null;
      const { minPrice: pMin } = getPricingInfo(sizes);
      if (minPrice !== undefined && pMin < minPrice) return false;
      if (maxPrice !== undefined && pMin > maxPrice) return false;
      return true;
    });
  }

  if (sort === "price-asc") {
    products.sort((a, b) => {
      const aPrice = getPricingInfo(a.sizes as unknown as ProductSizes | null).minPrice;
      const bPrice = getPricingInfo(b.sizes as unknown as ProductSizes | null).minPrice;
      return aPrice - bPrice;
    });
  } else if (sort === "price-desc") {
    products.sort((a, b) => {
      const aPrice = getPricingInfo(a.sizes as unknown as ProductSizes | null).minPrice;
      const bPrice = getPricingInfo(b.sizes as unknown as ProductSizes | null).minPrice;
      return bPrice - aPrice;
    });
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-16 md:px-6 lg:px-8 select-none text-center text-zinc-500 text-lg">
        <div className="mt-12 p-8 border border-zinc-200 bg-zinc-50 rounded-lg">
          <p className="font-bold uppercase tracking-widest">No products found.</p>
          <p className="text-sm mt-2">Please check back later or adjust your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-16 md:px-6 lg:px-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-x-8 lg:gap-x-12 mt-4">
        {/* Left Sidebar Column */}
        <div className="hidden md:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-4 pr-4 border-r border-zinc-200">
          <Suspense fallback={null}>
            <FilterSidebar brands={brands} categories={categories} maxPrice={overallMaxPrice} />
          </Suspense>
        </div>

        {/* Right Content Column */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between mb-4 gap-4">
            <Suspense fallback={null}>
              <ActiveFilters brands={brands} categories={categories} />
            </Suspense>
            <Suspense fallback={null}>
              <SortDropdown />
            </Suspense>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex md:hidden items-center justify-between mb-4">
            <Suspense fallback={null}>
              <FilterDrawer brands={brands} categories={categories} maxPrice={overallMaxPrice} />
            </Suspense>
          </div>

          <div className="border-l border-r border-zinc-200 md:border-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-b border-zinc-200">
              {products.map((product: ProductWithRelations) => {
                const sizes = product.sizes as unknown as ProductSizes | null;
                const availability = {
                  hasNew: ((sizes as ProductSizes)?.new?.length ?? 0) > 0,
                  hasUsed: ((sizes as ProductSizes)?.used?.length ?? 0) > 0,
                };
                const { minPrice: price, hasDiscount, regularPrice } = getPricingInfo(sizes);

                return (
                  <Link
                    href={`/product/${product.slug}`}
                    key={product.id}
                    className="aspect-[3/4] bg-white flex flex-col group cursor-pointer border border-zinc-200 border-b-4 transition-colors duration-200 hover:border-[#8AD658]"
                  >
                    <div className="relative w-full h-[60%] overflow-hidden bg-[#F6F6F6] border-b border-zinc-100 flex-shrink-0">
                      <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
                      <Image
                        src={product.image || "/assets/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-scale-down transition-transform duration-300 group-hover:scale-105"
                      />
                      {hasDiscount && (
                        <div className="absolute left-0 top-0 bg-black px-2 py-1 text-[8px] font-black uppercase text-white tracking-widest z-10">
                          Sale
                        </div>
                      )}
                      <div className="absolute right-0 top-0 flex z-10">
                        {availability.hasNew && (
                          <div className="bg-white px-1 border-l border-b border-zinc-100">
                            <span className="text-[8px] font-black uppercase text-zinc-900 tracking-tighter">New</span>
                          </div>
                        )}
                        {availability.hasUsed && (
                          <div className="bg-zinc-900 px-1">
                            <span className="text-[8px] font-black uppercase text-white tracking-tighter">Used</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 justify-between px-3 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          {product.brand?.name}
                        </span>
                        <h3 className="line-clamp-2 text-[13px] font-bold tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      <div className="pt-2">
                        <span className="text-base font-black tracking-tighter text-zinc-950">
                          {formatRupiah(price)}
                        </span>
                        {regularPrice !== price && (
                          <span className="ml-1.5 text-[12px] text-zinc-400 line-through">
                            {formatRupiah(regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
