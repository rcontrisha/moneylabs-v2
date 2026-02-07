// components/shared/footer.tsx
import Link from "next/link";
import Image from "next/image"; // 👈 Import Image
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Brand & Social */}
          <div className="space-y-4">
            {/* Logo Wrapper */}
            <Link href="/" className="flex items-center gap-2 inline-block">
              <Image 
                src="/assets/logo.png" 
                alt="MoneyLabs Logo" 
                width={48} 
                height={48} 
                className="h-10 w-auto object-contain" // Agak gedean dikit dari navbar
              />
              <span className="text-xl font-bold uppercase tracking-wider">
                MONEY<span className="text-primary">LABS</span>.
              </span>
            </Link>
            
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium sneakers authentic guarantee. The best place to cop your dream kicks.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/new-arrivals" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/brands" className="text-sm text-muted-foreground hover:text-primary transition-colors">Brands</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email address" />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2024 MoneyLabs Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
             <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
             <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}