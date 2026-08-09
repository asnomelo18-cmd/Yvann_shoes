import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("categories");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const productCount = await prisma.product.count({ where: { brandId: params.id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Impossible de supprimer : ${productCount} produit(s) utilisent cette marque.` },
      { status: 400 }
    );
  }

  await prisma.brand.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
