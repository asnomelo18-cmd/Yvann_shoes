import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const productCount = await prisma.productCategory.count({ where: { categoryId: params.id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Impossible de supprimer : ${productCount} produit(s) utilisent cette catégorie.` },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
