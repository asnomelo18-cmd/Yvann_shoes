import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET() {
  const admin = await requireSection("statistiques");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const [
    topProductsRaw,
    ordersByStatus,
    totalCustomers,
    pendingReviews,
    lowStockVariants,
    revenueAgg,
  ] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.review.count({ where: { status: "pending" } }),
    prisma.variant.count({ where: { stock: { lte: 3 } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAYEE", "PREPARATION", "EXPEDIEE", "LIVREE"] } },
    }),
  ]);

  const productIds = topProductsRaw.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  const topProducts = topProductsRaw.map((p) => ({
    name: products.find((prod) => prod.id === p.productId)?.name ?? "—",
    unitsSold: p._sum.quantity ?? 0,
  }));

  return NextResponse.json({
    topProducts,
    ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count._all })),
    totalCustomers,
    pendingReviews,
    lowStockVariants,
    totalRevenue: revenueAgg._sum.total ?? 0,
  });
}
