import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  if (!order) notFound();

  const transaction = await prisma.transaction.findUnique({
    where: { orderId: order.id },
  });

  const isPending = sp.status === "pending" || transaction?.status === "pending";
  const isPaid = transaction?.status === "paid";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-12 pb-24 md:px-6 lg:px-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center justify-center w-16 h-16 border border-zinc-200 mb-4">
          <span className="text-2xl font-black">✓</span>
        </span>
        <h1 className="text-sm font-black uppercase tracking-widest text-black mb-2">
          Order Placed
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Order #{order.id.slice(-8).toUpperCase()}
        </p>
      </div>

      <div className="border border-zinc-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Status
          </span>
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 ${
              isPaid
                ? "bg-black text-white"
                : isPending
                  ? "bg-zinc-100 text-zinc-600"
                  : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {isPaid ? "Paid" : isPending ? "Awaiting Payment" : "Confirmed"}
          </span>
        </div>

        <div className="border-t border-zinc-100 pt-4 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
            Items
          </h3>
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-1.5 border-b border-zinc-50 last:border-0"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  {item.product.name}
                </p>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider">
                  {item.selectedSize} · {item.condition} × {item.quantity}
                </p>
              </div>
              <span className="text-[10px] font-bold text-zinc-900">
                {formatRupiah(Number(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-100 pt-3 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
              Subtotal
            </span>
            <span className="text-xs font-bold text-zinc-900">
              {formatRupiah(Number(order.subtotal))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
              Shipping
            </span>
            <span className="text-xs font-bold text-zinc-400">
              {formatRupiah(0)}
            </span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-zinc-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-black">
              Total
            </span>
            <span className="text-sm font-black tracking-tighter text-zinc-950">
              {formatRupiah(Number(order.total))}
            </span>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
            Shipping To
          </h3>
          <p className="text-[10px] font-bold uppercase text-zinc-600">
            {order.name}
          </p>
          <p className="text-[9px] text-zinc-400 uppercase tracking-wider">
            {order.phone}
          </p>
          <p className="text-[9px] text-zinc-400">
            {order.address}, {order.city} {order.state}, {order.country}{" "}
            {order.zip}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="inline-block border border-zinc-300 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:border-black hover:text-black transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
