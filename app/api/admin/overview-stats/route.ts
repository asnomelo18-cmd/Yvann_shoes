import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [revenueAgg, ordersToday, newCustomersThisMonth, lowStockVariants] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ["PAYEE", "PREPARATION", "EXPEDIEE", "LIVREE"] },
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.user.count({ where: { role: "CLIENT", createdAt: { gte: startOfMonth } } }),
    prisma.variant.count({ where: { stock: { lte: 3 } } }),
  ]);

  return NextResponse.json({
    revenueThisMonth: revenueAgg._sum.total ?? 0,
    ordersToday,
    newCustomersThisMonth,
    lowStockVariants,
  });
}
