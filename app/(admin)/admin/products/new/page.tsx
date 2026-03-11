import { prisma } from "@/lib/prisma";
import ProductForm from "./product-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function NewProductPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Replacement */}
      <Breadcrumb>
        <BreadcrumbList className="text-[11px] font-medium uppercase tracking-wider">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard" className="text-zinc-400 hover:text-zinc-900 transition-colors">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/products" className="text-zinc-400 hover:text-zinc-900 transition-colors">Inventory</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-zinc-900 font-bold">Add New Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}