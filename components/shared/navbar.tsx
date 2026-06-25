"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import SearchMenu from "@/components/shared/search-menu";
import { CategoryBar } from "@/components/shared/navbar-category-bar";

const mobileLinks = [
  { label: "New Arrivals", href: "/shop?sort=latest" },
  { label: "Men", href: "/shop?category=men" },
  { label: "Women", href: "/shop?category=women" },
  { label: "Used Steals", href: "/shop?condition=used" },
  { label: "All Brands", href: "/shop" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  return (
    <>
      {/* Row 1 — Trust Bar */}
      <div className="w-full bg-zinc-950 text-white text-center py-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest select-none">
        100% Authentic · Free Shipping · Easy Returns · 24/7 Support
      </div>

      {/* Row 2 — Main Nav */}
      <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[56px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 lg:justify-normal lg:gap-4">
          {/* Hamburger (mobile) */}
          <div className="lg:hidden relative">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 relative"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
              {hydrated && totalItems > 0 && (
                <Badge className="absolute -right-0 -top-0 h-3.5 w-3.5 items-center justify-center rounded-full bg-primary p-0 text-[8px] text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>
          </div>

          {/* Logo */}
          <div className="flex lg:w-auto">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/assets/moneylab.png"
                alt="MoneyLabs Logo"
                width={70}
                height={70}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
              <span className="text-base lg:text-lg font-black uppercase tracking-widest">
                MONEY<span className="text-primary">LABS</span>
              </span>
            </Link>
          </div>

          {/* Desktop: Search Center */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="w-full max-w-[760px]">
              <SearchMenu />
            </div>
          </div>

          {/* Icons: Search (mobile), User (desktop), Cart (desktop) */}
          <div className="flex items-center gap-x-1">
            {/* Mobile Search */}
            <div className="lg:hidden">
              <SearchMenu />
            </div>

            {/* Desktop User */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex hover:bg-transparent hover:text-primary transition-colors"
            >
              <User className="size-5" />
            </Button>

            {/* Desktop Cart */}
            <Link href="/cart" className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-transparent hover:text-primary transition-colors"
              >
                <ShoppingBag className="size-5" />
                {hydrated && totalItems > 0 && (
                  <Badge className="absolute -right-0 -top-0 h-4 w-4 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Row 3 — Category Bar (desktop) */}
        <CategoryBar />
      </nav>

      {/* Mobile Hamburger Sheet — always mounted, CSS transition */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
        mobileOpen ? "visible" : "invisible delay-300"
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sheet */}
        <div className={`absolute left-0 top-0 bottom-0 w-[300px] bg-white border-r border-zinc-200 shadow-lg transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-100">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2"
            >
              <Image
                src="/assets/moneylab.png"
                alt="MoneyLabs Logo"
                width={40}
                height={40}
                className="h-8 w-auto object-contain"
              />
              <span className="text-lg font-black uppercase tracking-widest">
                MONEY<span className="text-primary">LABS</span>
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Login / Register Buttons */}
          <div className="flex gap-3 px-4 py-3 border-b border-zinc-100">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 border border-zinc-300 text-center py-2 text-xs font-bold uppercase tracking-wider text-black hover:border-black transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 border border-zinc-300 text-center py-2 text-xs font-bold uppercase tracking-wider text-black hover:border-black transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="flex flex-col h-[calc(100%-57px)] p-4">
            {/* Category Links */}
            <div className="flex-1 space-y-1">
              {mobileLinks.map((link) => {
                const isActive = link.href.startsWith("/about")
                  ? pathname === "/about"
                  : link.href === "/shop" && pathname === "/shop";

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block py-2.5 text-sm font-bold uppercase tracking-wider transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-black hover:text-zinc-500",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto mb-10 border-t border-zinc-100 pt-4 space-y-5">
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black hover:text-primary transition-colors"
              >
                <ShoppingBag className="size-5" />
                Cart
                {hydrated && totalItems > 0 && (
                  <span className="text-primary text-xs">
                    ({totalItems})
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black hover:text-primary transition-colors"
              >
                <Heart className="size-5" />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
