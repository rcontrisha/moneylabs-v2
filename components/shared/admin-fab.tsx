// components/shared/admin-fab.tsx
"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AdminFab() {
  // Nanti di sini bisa dikasih logic: 
  // if (user.role !== 'ADMIN') return null;

  return (
    <Link
      href="/admin/dashboard"
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-2xl transition-all hover:scale-110 hover:bg-zinc-800 active:scale-95 group"
    >
      <ShieldCheck className="h-6 w-6 transition-transform group-hover:rotate-12" />
      
      {/* Tooltip Gaya MoneyLabs */}
      <span className="absolute right-full mr-4 scale-0 rounded-lg bg-black px-4 py-2 text-[10px] font-black uppercase italic tracking-widest text-white transition-all group-hover:scale-100">
        Admin Area
      </span>
    </Link>
  );
}