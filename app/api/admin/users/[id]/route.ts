import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const patchSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "SUPPORT", "VENDEUR", "CLIENT"]),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  if (admin.id === params.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas modifier votre propre rôle." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role: parsed.data.role },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "user.role_change",
      entity: "User",
      entityId: user.id,
      metadata: { newRole: parsed.data.role },
    },
  });

  return NextResponse.json({ user });
}
