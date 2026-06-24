"use client";

import { ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Jaminan uang kembali jika barang terbukti palsu/KW.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Gratis ongkir ke seluruh Indonesia tanpa minimum belanja.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Salah ukuran? Tenang, bisa tukar sepuasnya dalam 7 hari.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Customer service kami siap nemenin galau lu kapan aja.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="border-y bg-gray-50 lg:py-12 py-8">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index}>
              <div className="flex items-start gap-4 py-3 sm:flex-col sm:items-center sm:text-center sm:py-0">
                <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <benefit.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold uppercase tracking-wide text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-0.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
              {index < benefits.length - 1 && (
                <div className="border-t border-zinc-200 sm:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
