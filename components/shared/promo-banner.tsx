"use client";

import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="w-full">
      {/* Ganti path ini jika kamu menaruh gambar di lokasi lain atau pakai URL */}
      <Image
        src="/assets/banner/Mid Season Banner.png"
        alt="Promo Banner"
        width={1600}
        height={600}
        className="w-full h-auto"
        priority
      />
    </section>
  );
}