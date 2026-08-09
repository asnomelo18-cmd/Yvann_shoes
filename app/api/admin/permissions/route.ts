import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, requireSuperAdmin } from "@/lib/session";
import { getRolePermissions, saveRolePermissions } from "@/lib/settings";
import { ADMIN_SECTIONS } from "@/lib/permissions";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const permissions = await getRolePermissions();
  return NextResponse.json({ permissions, role: user.role });
}

const sectionKeys = ADMIN_SECTIONS.map((s) => s.key) as [string, ...string[]];
const putSchema = z.object({
  MANAGER: z.array(z.enum(sectionKeys)),
  SUPPORT: z.array(z.enum(sectionKeys)),
  VENDEUR: z.array(z.enum(sectionKeys)),
});

export async function PUT(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });

  await saveRolePermissions(parsed.data as any);

  return NextResponse.json({ permissions: parsed.data });
}
