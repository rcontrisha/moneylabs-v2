// app/(admin)/admin/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();

  const stats = [
    { label: "Total Products", value: productCount, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Orders", value: orderCount, icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Users", value: userCount, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Revenue", value: "Rp 0", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-zinc-900">
          Dashboard <span className="text-primary">Overview</span>
        </h2>
        <p className="text-sm font-medium text-zinc-400">Manage your sneaker empire from here.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
            <div className={`${stat.bg} ${stat.color} flex h-12 w-12 items-center justify-center rounded-2xl`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{stat.label}</span>
              <span className="text-2xl font-black italic tracking-tighter text-zinc-900">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8">
          <h3 className="mb-4 text-lg font-black uppercase italic tracking-tight">Recent Activity</h3>
          <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-300">No activity yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}