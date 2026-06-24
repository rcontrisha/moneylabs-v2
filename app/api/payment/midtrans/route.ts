import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const orderId = body.order_id;

    const hash = crypto
      .createHash("sha512")
      .update(orderId + body.status_code + body.gross_amount + serverKey)
      .digest("hex");

    if (body.signature_key !== hash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const transactionStatus = body.transaction_status as string;

    let orderStatus: string | null = null;
    let paymentStatus: string | null = null;

    switch (transactionStatus) {
      case "capture":
      case "settlement":
        orderStatus = "ordered";
        paymentStatus = "paid";
        break;
      case "pending":
        paymentStatus = "pending";
        break;
      case "deny":
      case "cancel":
      case "expire":
        orderStatus = "canceled";
        paymentStatus = "failed";
        break;
    }

    await prisma.transaction.updateMany({
      where: { orderId },
      data: {
        status: paymentStatus ?? undefined,
        midtransId: body.transaction_id ?? undefined,
        paymentType: body.payment_type ?? undefined,
        payload: body,
      },
    });

    if (orderStatus) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: orderStatus as any },
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
