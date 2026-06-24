"use client";

import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="w-full">
      <Image
        src="/assets/banner/Mid Season Banner 2.png"
        alt="Promo Banner"
        width={1600}
        height={600}
        className="w-full h-auto object-cover object-[50%_30%]"
        sizes="100vw"
        priority
      />
    </section>
  );
}
