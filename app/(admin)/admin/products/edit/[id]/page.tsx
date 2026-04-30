import ProductForm from "../../new/product-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) notFound();

  // find by id or fallback to slug
  const product = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  if (!product) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Edit Product</h1>
      <ProductForm brands={brands} categories={categories} initialData={product} />
    </div>
  );
}
