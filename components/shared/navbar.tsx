// components/shared/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // 👈 Buat ngecek kita lagi di halaman mana
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname(); // Dapetin URL sekarang (misal: /shop)

  // Array menu biar kodingan lebih bersih & gampang diatur
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 1. Mobile Menu (Hamburger) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left font-bold uppercase flex items-center gap-3">
                  <Image 
                    src="/assets/logo.png" 
                    alt="MoneyLabs Logo" 
                    width={40} 
                    height={40} 
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-xl tracking-tighter">MONEY<span className="text-primary">LABS</span>.</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-10 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={cn(
                      "text-lg font-bold uppercase tracking-wider transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-black"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 2. Logo Utama */}
        <div className="flex lg:w-0 lg:flex-1">
          <Link href="/" className="flex items-center gap-3 group"> 
            <Image 
              src="/assets/logo.png" 
              alt="MoneyLabs Logo" 
              width={50} 
              height={50} 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span className="text-xl font-black uppercase tracking-widest hidden sm:block">
              MONEY<span className="text-primary">LABS</span>.
            </span>
             <span className="text-xl font-black uppercase tracking-widest sm:hidden">
              ML<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* 3. Desktop Menu - THE "LINE" STYLE 🚀 */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "relative py-2 text-sm font-bold uppercase tracking-widest transition-colors hover:text-black",
                  // Kalau aktif, text jadi item. Kalau enggak, abu-abu (muted).
                  isActive ? "text-black" : "text-muted-foreground"
                )}
              >
                {link.name}
                {/* INI DIA MAGIC LINE-NYA (Garis Bawah Animasi) */}
                <span 
                  className={cn(
                    "absolute inset-x-0 -bottom-[1px] h-[2px] bg-primary transition-transform duration-300 ease-out",
                    // Kalau aktif scale 1 (muncul), kalau enggak scale 0 (ilang)
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} 
                />
              </Link>
            );
          })}
        </div>

        {/* 4. Icons */}
        <div className="flex flex-1 items-center justify-end gap-x-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-transparent hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-transparent hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <Badge 
                className="absolute -right-0 -top-0 h-4 w-4 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-white"
              >
                0
              </Badge>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}