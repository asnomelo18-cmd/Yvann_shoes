import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET() {
  const admin = await requireSection("clients");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      usualSize: true,
      loyaltyPoints: true,
      createdAt: true,
      orders: { select: { total: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    clients: clients.map((c) => ({
      id: c.id,
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
      usualSize: c.usualSize,
      loyaltyPoints: c.loyaltyPoints,
      createdAt: c.createdAt,
      orderCount: c.orders.length,
      totalSpent: c.orders
        .filter((o) => ["PAYEE", "PREPARATION", "EXPEDIEE", "LIVREE"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.total), 0),
    })),
  });
}
