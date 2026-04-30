// lib/actions/product.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  // 1. Ambil data pake .get() karena ini objek FormData wir 
  const name = formData.get("name") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const SKU = formData.get("SKU") as string;
  const stockStatus = formData.get("stockStatus") as string;
  const shortDesc = formData.get("shortDesc") as string;
  const description = formData.get("description") as string;
  
  // Ambil data dari hidden inputs
  const image = formData.get("image") as string;
  const images = formData.get("images") as string; // Ini udah string dari client (join koms) 
  const featured = formData.get("featured") === "true";
  const quantity = parseInt(formData.get("quantity") as string) || 0;
  
  // 2. Parse JSON sizes balik jadi objek 
  const sizesJson = formData.get("sizes") as string;
  const sizes = sizesJson ? JSON.parse(sizesJson) : null;

  // 3. Bikin Slug otomatis dari nama produk 
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 4. Simpan ke database sesuai schema.prisma 
  const productId = formData.get("productId") as string | null;

  if (productId) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        SKU,
        shortDesc,
        description,
        stockStatus,
        quantity,
        featured,
        image,
        images,
        brandId,
        categoryId,
        sizes,
      },
    });
  } else {
    await prisma.product.create({
      data: {
        name,
        slug,
        SKU,
        shortDesc,
        description,
        stockStatus,
        quantity,
        featured,
        image,
        images, // Simpan langsung sebagai string (udah di-join di client) 
        brandId,
        categoryId,
        sizes, // Masuk sebagai JSON 
      },
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  if (!productId) return;

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}