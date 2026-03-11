// app/(admin)/layout.tsx
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  ExternalLink 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { label: "Customers", icon: Users, href: "/admin/users" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-zinc-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-20 items-center px-8">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Money<span className="text-primary">Labs</span>
              <span className="ml-1 text-[10px] not-italic text-zinc-400">ADMIN</span>
            </h2>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-tight text-zinc-500 transition-all hover:bg-zinc-100 hover:text-black"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer Sidebar */}
          <div className="border-t border-zinc-100 p-4 space-y-1">
            <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-tight text-zinc-500 hover:bg-zinc-100">
              <ExternalLink className="h-5 w-5" />
              View Store
            </Link>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-tight text-red-500 hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="ml-64 w-full">
        <header className="flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-10">
          <div className="flex flex-col">
            <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Admin Control Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-600">
              A
            </div>
          </div>
        </header>
        <div className="p-10">{children}</div>
      </main>
    </div>
  );
}