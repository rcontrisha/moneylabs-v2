"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const categoryLinks = [
  { label: "New Arrivals", href: "/shop?sort=latest" },
  { label: "Men", href: "/shop?category=men" },
  { label: "Women", href: "/shop?category=women" },
  { label: "Used Steals", href: "/shop?condition=used" },
  { label: "All Brands", href: "/shop" },
  { label: "About", href: "/about" },
];

export function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center justify-center gap-8 border-t border-b border-zinc-100 bg-white">
      {categoryLinks.map((link) => {
        const isActive = link.href.startsWith("/about")
          ? pathname === "/about"
          : link.href === "/shop" && pathname === "/shop";

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "py-2 text-xs font-bold uppercase tracking-widest transition-colors",
              isActive
                ? "text-black border-b-2 border-black -mb-[2px]"
                : "text-zinc-500 hover:text-black",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
