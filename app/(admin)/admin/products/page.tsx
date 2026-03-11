// app/(admin)/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-zinc-900">
            Inventory <span className="text-primary">Management</span>
          </h2>
          <p className="text-sm font-medium text-zinc-400">Manage stock, prices, and condition listing.</p>
        </div>
        <Button asChild className="h-14 rounded-2xl bg-black px-8 font-black uppercase italic tracking-tight text-white transition-all hover:bg-zinc-800">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add New Sneaker
          </Link>
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 border-b border-zinc-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Product</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Brand/Category</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id} className="group transition-colors hover:bg-zinc-50/30">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-100">
                      <Image
                        src={product.image || "/assets/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase italic tracking-tight text-zinc-900">{product.name}</span>
                      <span className="text-[10px] font-bold text-zinc-400">{product.SKU || "NO-SKU"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase text-zinc-700 tracking-tighter">{product.brand?.name}</span>
                    <span className="text-[10px] font-medium text-zinc-400">{product.category?.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                    product.stockStatus === 'instock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stockStatus}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-zinc-100">
                      <Edit2 className="h-4 w-4 text-zinc-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}