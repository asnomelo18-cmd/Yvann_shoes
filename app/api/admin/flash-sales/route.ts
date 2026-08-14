import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET() {
  const admin = await requireSection("promotions");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const flashSales = await prisma.flashSale.findMany({
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { startsAt: "desc" },
  });

  return NextResponse.json({ flashSales });
}

const createSchema = z.object({
  name: z.string().min(2),
  startsAt: z.string(),
  endsAt: z.string(),
  items: z.array(z.object({ productId: z.string(), discountPct: z.number().min(1).max(90) })).min(1),
});

export async function POST(request: Request) {
  const admin = await requireSection("promotions");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });

  const flashSale = await prisma.flashSale.create({
    data: {
      name: parsed.data.name,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt),
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          discountPct: item.discountPct,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ flashSale }, { status: 201 });
}
