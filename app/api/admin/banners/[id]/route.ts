import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

const patchSchema = z.object({ isActive: z.boolean() });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("contenu");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const banner = await prisma.banner.update({
    where: { id: params.id },
    data: { isActive: parsed.data.isActive },
  });
  return NextResponse.json({ banner });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("contenu");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
