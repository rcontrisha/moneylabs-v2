"use server";

import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

interface CartItemInput {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  brandName: string;
  size: string;
  condition: "new" | "used";
  regularPrice: number;
  salePrice: number | null;
  quantity: number;
}

function validateCartItems(data: unknown): CartItemInput[] {
  if (!Array.isArray(data)) {
    throw new Error("cartItems harus berupa array");
  }
  if (data.length === 0) {
    throw new Error("Keranjang kosong");
  }
  for (const item of data) {
    if (!item || typeof item !== "object") {
      throw new Error("Format item tidak valid");
    }
    if (!item.productId || typeof item.productId !== "string") {
      throw new Error("productId wajib diisi");
    }
    if (!item.size || typeof item.size !== "string") {
      throw new Error("size wajib diisi");
    }
    if (!item.condition || !["new", "used"].includes(item.condition)) {
      throw new Error(`condition harus "new" atau "used"`);
    }
    if (!item.name || typeof item.name !== "string") {
      throw new Error("name wajib diisi");
    }
    if (typeof item.regularPrice !== "number" || item.regularPrice <= 0) {
      throw new Error("regularPrice wajib diisi dan > 0");
    }
    if (typeof item.salePrice !== "number" && item.salePrice !== null) {
      throw new Error("salePrice harus number atau null");
    }
    if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
      throw new Error("quantity wajib diisi dan > 0");
    }
  }
  return data as CartItemInput[];
}

export async function createOrderWithPayment(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const country = (formData.get("country") as string) || "Indonesia";
    const guestId = (formData.get("guestId") as string) || "guest";
    const landmark = formData.get("landmark") as string | null;
    const zip = formData.get("zip") as string | null;

    if (!name || !phone || !address) {
      return { success: false, error: "Nama, telepon, dan alamat wajib diisi!" };
    }

    let cartItems: CartItemInput[];
    try {
      const raw = JSON.parse(formData.get("cartItems") as string);
      cartItems = validateCartItems(raw);
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Data keranjang tidak valid",
      };
    }

    const subtotal = cartItems.reduce(
      (sum, i) => sum + (i.salePrice ?? i.regularPrice) * i.quantity,
      0,
    );

    let user = await prisma.user.findUnique({ where: { id: guestId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: guestId,
          name: "Guest",
          email: `${guestId}@guest.local`,
          password: "guest",
          role: "USER",
        },
      });
    }
    const userId = user.id;

    const order = await prisma.$transaction(async (tx) => {
      // ---- STOCK CHECK & DECREMENT ----
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { sizes: true, name: true },
        });

        if (!product) {
          throw new Error(`Produk "${item.name}" tidak ditemukan`);
        }

        const sizes = product.sizes as any;
        const variants =
          item.condition === "new"
            ? sizes?.new || []
            : sizes?.used || [];

        const variant = variants.find((v: any) => v.size === item.size);

        if (!variant || variant.stock <= 0) {
          throw new Error(
            `Stok ${product.name} ukuran ${item.size} (${item.condition}) udah abis!`,
          );
        }

        if (variant.stock < item.quantity) {
          throw new Error(
            `Stok ${product.name} ukuran ${item.size} (${item.condition}) cuma sisa ${variant.stock}!`,
          );
        }

        variant.stock -= item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { sizes },
        });
      }

      // ---- CREATE ORDER ----
      const createdOrder = await tx.order.create({
        data: {
          userId,
          subtotal,
          discount: 0,
          tax: 0,
          total: subtotal,
          name,
          phone,
          locality: address,
          address,
          city: city || "",
          state: state || "",
          country,
          landmark: landmark || null,
          zip: zip || null,
          status: "pending_payment",
        },
      });

      // ---- CREATE ORDER ITEMS ----
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            price: item.salePrice ?? item.regularPrice,
            quantity: item.quantity,
            selectedSize: item.size,
            condition: item.condition,
          },
        });
      }

      // ---- CREATE TRANSACTION ----
      await tx.transaction.create({
        data: {
          userId,
          orderId: createdOrder.id,
          mode: "midtrans",
          status: "pending",
        },
      });

      return createdOrder;
    });

    // ---- MIDTRANS API (outside transaction) ----
    const midtransParams = {
      transaction_details: {
        order_id: order.id,
        gross_amount: Number(subtotal),
      },
      customer_details: {
        first_name: name,
        phone,
        billing_address: {
          address,
          city: city || "",
          country_code: "IDN",
        },
      },
      item_details: cartItems.map((item) => ({
        id: item.productId,
        price: Number(item.salePrice ?? item.regularPrice),
        quantity: item.quantity,
        name: `${item.name} - ${item.size} (${item.condition})`,
      })),
    };

    const snapTransaction = await snap.createTransaction(midtransParams);

    return {
      success: true,
      snapToken: snapTransaction.token,
      orderId: order.id,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal membuat pesanan. Silakan coba lagi.",
    };
  }
}
