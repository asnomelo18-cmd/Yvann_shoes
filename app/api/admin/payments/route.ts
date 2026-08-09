import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET(request: Request) {
  const admin = await requireSection("paiements");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const payments = await prisma.payment.findMany({
    where: status ? { status: status as any } : undefined,
    include: { order: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    payments: payments.map((p) => ({
      id: p.id,
      orderNumber: p.order.orderNumber,
      customerName: `${p.order.user.firstName ?? ""} ${p.order.user.lastName ?? ""}`.trim(),
      amount: p.amount,
      method: p.method,
      transactionReference: p.transactionReference,
      status: p.status,
      createdAt: p.createdAt,
    })),
  });
}
