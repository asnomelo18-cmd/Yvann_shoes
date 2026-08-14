import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("promotions");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.flashSale.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
