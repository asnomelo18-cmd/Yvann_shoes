import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET(request: Request) {
  const admin = await requireSection("commandes");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      user: true,
      payment: true,
      items: { include: { product: true, variant: { include: { size: true, color: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: `${o.user.firstName ?? ""} ${o.user.lastName ?? ""}`.trim(),
      status: o.status,
      total: o.total,
      paymentMethod: o.payment?.method ?? null,
      itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
      createdAt: o.createdAt,
    })),
  });
}
