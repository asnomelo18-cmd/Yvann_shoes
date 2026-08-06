import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const patchSchema = z.object({ status: z.enum(["approved", "rejected"]) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });

  const review = await prisma.review.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  // Recalcule la note moyenne du produit à partir des avis approuvés
  const approved = await prisma.review.findMany({
    where: { productId: review.productId, status: "approved" },
    select: { rating: true },
  });
  const avgRating = approved.length
    ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
    : 0;
  await prisma.product.update({
    where: { id: review.productId },
    data: { avgRating, reviewCount: approved.length },
  });

  return NextResponse.json({ review });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
