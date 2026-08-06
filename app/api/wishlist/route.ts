import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { brand: true, images: { orderBy: { position: "asc" }, take: 1 } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      items: items.map((item) => ({
        productId: item.productId,
        slug: item.product.slug,
        name: item.product.name,
        brand: item.product.brand.name,
        basePrice: item.product.basePrice,
        compareAtPrice: item.product.compareAtPrice,
        imageUrl: item.product.images[0]?.url ?? null,
        avgRating: item.product.avgRating,
      })),
    });
  } catch (error) {
    console.error("Erreur /api/wishlist (GET) :", error);
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

    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: user.id, productId: parsed.data.productId } },
      update: {},
      create: { userId: user.id, productId: parsed.data.productId },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Erreur /api/wishlist (POST) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
