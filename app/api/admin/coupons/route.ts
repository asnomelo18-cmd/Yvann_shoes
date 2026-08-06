import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

const createSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderValue: z.number().optional(),
  usageLimit: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });

  try {
    const coupon = await prisma.coupon.create({
      data: { ...parsed.data, code: parsed.data.code.toUpperCase() },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ce code existe déjà." }, { status: 409 });
  }
}
