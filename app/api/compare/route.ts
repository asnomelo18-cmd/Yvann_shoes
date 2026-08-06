import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const MAX_COMPARE = 4;

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const items = await prisma.comparisonItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { brand: true, images: { orderBy: { position: "asc" }, take: 1 } },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      items: items.map((item) => ({
        productId: item.productId,
        slug: item.product.slug,
        name: item.product.name,
        brand: item.product.brand.name,
        imageUrl: item.product.images[0]?.url ?? null,
        basePrice: item.product.basePrice,
        weightGrams: item.product.weightGrams,
        drop: item.product.drop,
        soleType: item.product.soleType,
        usage: item.product.usage,
        gender: item.product.gender,
        avgRating: item.product.avgRating,
      })),
    });
  } catch (error) {
    console.error("Erreur /api/compare (GET) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

const addSchema = z.object({ productId: z.string() });

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const body = await request.json();
    const parsed = addSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

    const count = await prisma.comparisonItem.count({ where: { userId: user.id } });
    if (count >= MAX_COMPARE) {
      return NextResponse.json(
        { error: `Vous pouvez comparer jusqu'à ${MAX_COMPARE} paires à la fois.` },
        { status: 400 }
      );
    }

    await prisma.comparisonItem.upsert({
      where: { userId_productId: { userId: user.id, productId: parsed.data.productId } },
      update: {},
      create: { userId: user.id, productId: parsed.data.productId },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Erreur /api/compare (POST) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
