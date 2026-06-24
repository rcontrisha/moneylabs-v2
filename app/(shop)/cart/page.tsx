"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/stores/cart-store";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!hydrated || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center select-none px-4">
        <h1 className="text-lg font-black uppercase tracking-widest text-zinc-300 mb-6">
          Your Cart is Empty
        </h1>
        <Link
          href="/shop"
          className="border border-zinc-300 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:border-black hover:text-black transition-colors"
        >
          View Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.regularPrice) * i.quantity,
    0,
  );
  const grandTotal = subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-24 md:px-6 lg:px-8">
      <h1 className="text-sm font-black uppercase tracking-widest text-black pb-4 border-b border-zinc-200 mb-6">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] gap-8 md:gap-12">
        {/* LEFT — Product List */}
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const effectivePrice = item.salePrice ?? item.regularPrice;
            const lineTotal = effectivePrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-zinc-200"
              >
                <div className="relative w-[88px] h-[88px] flex-shrink-0 bg-[#F6F6F6] overflow-hidden">
                  <Image
                    src={item.image || "/assets/placeholder.svg"}
                    alt={item.name}
                    fill
                    sizes="88px"
                    className="object-scale-down"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 truncate">
                        {item.brandName}
                      </span>
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-sm font-bold uppercase tracking-tight text-zinc-900 hover:text-zinc-500 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider">
                        <span>Size: {item.size}</span>
                        <span className="text-zinc-300">·</span>
                        <span
                          className={
                            item.condition === "new"
                              ? "text-black font-bold"
                              : "text-zinc-500 font-bold"
                          }
                        >
                          {item.condition === "new" ? "New" : "Used"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-zinc-400 block">
                        {formatRupiah(item.salePrice ?? item.regularPrice)} ×{" "}
                        {item.quantity}
                      </span>
                      {item.salePrice ? (
                        <>
                          <span className="text-sm font-black tracking-tighter text-zinc-950">
                            {formatRupiah(lineTotal)}
                          </span>
                          <br />
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatRupiah(item.regularPrice * item.quantity)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-black tracking-tighter text-zinc-950">
                          {formatRupiah(lineTotal)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                    <div className="flex items-center border border-zinc-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1 text-xs font-bold text-zinc-400 hover:bg-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2.5 py-1 text-xs font-bold text-zinc-400 hover:bg-zinc-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Order Summary */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="border border-zinc-200 p-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-black">
              Order Summary
            </h2>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                  Subtotal
                </span>
                <span className="text-xs font-bold text-zinc-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                  Platform Fee
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  {formatRupiah(0)}
                </span>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                Total
              </span>
              <span className="text-base font-black tracking-tighter text-zinc-950">
                {formatRupiah(grandTotal)}
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Enter Voucher Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="VOUCHER CODE"
                  className="flex-[2] border-b border-zinc-300 bg-transparent py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300"
                />
                <button className="flex-[1] border border-zinc-300 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:border-black hover:text-black transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <Link href="/checkout">
              <button className="w-full h-12 bg-zinc-950 text-white text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
