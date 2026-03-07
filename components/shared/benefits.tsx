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
    <section className="border-y bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}