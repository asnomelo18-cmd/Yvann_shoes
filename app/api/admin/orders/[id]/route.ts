import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      payment: true,
      shippingAddress: true,
      items: { include: { product: true, variant: { include: { size: true, color: true } } } },
    },
  });

  if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  return NextResponse.json({ order });
}

const patchSchema = z.object({
  status: z.enum(["EN_ATTENTE", "PAYEE", "PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE", "REMBOURSEE"]),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "order.status_change",
      entity: "Order",
      entityId: order.id,
      metadata: { newStatus: parsed.data.status },
    },
  });

  return NextResponse.json({ order });
}
