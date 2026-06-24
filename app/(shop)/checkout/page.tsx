"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCartStore } from "@/lib/stores/cart-store";
import { createOrderWithPayment } from "@/lib/actions/order";
import { getGuestId } from "@/lib/guest-id";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const inputClass =
  "w-full border-b border-zinc-300 bg-transparent py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300";

const labelClass = "text-[10px] font-bold uppercase tracking-widest text-black mb-1 block";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [zip, setZip] = useState("");
  const [landmark, setLandmark] = useState("");

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.regularPrice) * i.quantity,
    0,
  );

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-24 md:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-zinc-100" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div className="h-96 bg-zinc-50" />
            <div className="h-64 bg-zinc-50" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !address) {
      setError("Nama, telepon, dan alamat wajib diisi.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("landmark", landmark);
    formData.append("zip", zip);
    formData.append("guestId", getGuestId());
    formData.append(
      "cartItems",
      JSON.stringify(
        items.map((item) => ({
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          image: item.image,
          brandName: item.brandName,
          size: item.size,
          condition: item.condition,
          regularPrice: item.regularPrice,
          salePrice: item.salePrice,
          quantity: item.quantity,
        })),
      ),
    );

    const result = await createOrderWithPayment(formData);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Gagal membuat pesanan.");
      return;
    }

    (window as any).snap.pay(result.snapToken, {
      onSuccess: () => {
        clearCart();
        router.push(`/orders/${result.orderId}/confirmation`);
      },
      onPending: () => {
        clearCart();
        router.push(`/orders/${result.orderId}/confirmation?status=pending`);
      },
      onError: () => {
        setError("Pembayaran gagal. Silakan coba lagi.");
      },
      onClose: () => {
        // user closed the popup without paying
      },
    });
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!}
        strategy="lazyOnload"
      />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-24 md:px-6 lg:px-8">
        <h1 className="text-sm font-black uppercase tracking-widest text-black pb-4 border-b border-zinc-200 mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* LEFT — Shipping Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-black mb-4">
                Shipping Information
              </h2>

              {error && (
                <div className="border border-red-300 bg-red-50 px-4 py-3 mb-4 text-[10px] font-bold uppercase tracking-wider text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Contoh No. 123"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kota"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Provinsi"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Indonesia"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="Kode Pos"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Patokan (opsional)"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-zinc-950 text-white text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </form>

          {/* RIGHT — Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="border border-zinc-200 p-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-black">
                Order Summary
              </h2>

              <div className="divide-y divide-zinc-100">
                {items.map((item) => {
                  const price = item.salePrice ?? item.regularPrice;
                  return (
                    <div key={item.id} className="flex justify-between py-2 gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-wider">
                          {item.size} · {item.condition} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-900 flex-shrink-0">
                        {formatRupiah(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-100 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                    Subtotal
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                    Shipping
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
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/cart"
              className="block mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-black transition-colors"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
