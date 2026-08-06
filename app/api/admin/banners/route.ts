import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const banners = await prisma.banner.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ banners });
}

const createSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url(),
  linkUrl: z.string().optional(),
  position: z.string().min(1),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });

  const banner = await prisma.banner.create({ data: { ...parsed.data, isActive: true } });
  return NextResponse.json({ banner }, { status: 201 });
}
