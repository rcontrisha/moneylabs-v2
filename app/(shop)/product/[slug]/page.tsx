// app/(shop)/product/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "./components/gallery";
import { ProductInfo } from "./components/product-info";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: slug }, 
    include: { brand: true, category: true },
  });

  if (!product) notFound();

  const galleryImages = [product.image, ...(product.images?.split(",").filter(Boolean) || [])];

  return (
    // 🚀 FIX: Tambah pb-32 biar gak nabrak footer wir
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-32 space-y-12">
      <Breadcrumb>
        <BreadcrumbList className="text-[10px] font-bold uppercase tracking-widest">
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/shop">Shop</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="text-zinc-400">{product.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* KIRI: Gallery & Description */}
        <div className="lg:col-span-7 space-y-20">
          <ProductGallery images={galleryImages as string[]} />
          
          {/* Description Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-zinc-100 pb-4">
              Description
            </h3>
            <div className="text-sm text-zinc-600 leading-relaxed max-w-2xl whitespace-pre-line font-medium">
              {product.description || "No description available."}
            </div>
          </div>
        </div>

        {/* KANAN: Info & Action */}
        <div className="lg:col-span-5">
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}