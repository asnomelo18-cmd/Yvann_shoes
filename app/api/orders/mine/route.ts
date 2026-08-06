import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        payment: true,
        items: { include: { product: true, variant: { include: { size: true, color: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        paymentStatus: o.payment?.status ?? null,
        itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erreur /api/orders (GET) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
