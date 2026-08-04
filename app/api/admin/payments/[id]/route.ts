import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const patchSchema = z.object({
  status: z.enum(["VALIDE", "ECHOUE"]),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { id: params.id } });
  if (!payment) return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });

  const updated = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status,
        validatedById: admin.id,
        paidAt: parsed.data.status === "VALIDE" ? new Date() : null,
      },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: parsed.data.status === "VALIDE" ? "PAYEE" : "ANNULEE" },
    });

    await tx.auditLog.create({
      data: {
        userId: admin.id,
        action: parsed.data.status === "VALIDE" ? "payment.validate" : "payment.reject",
        entity: "Payment",
        entityId: payment.id,
      },
    });

    return updatedPayment;
  });

  return NextResponse.json({ payment: updated });
}
