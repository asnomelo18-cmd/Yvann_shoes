import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function DELETE(_request: Request, { params }: { params: { productId: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    await prisma.wishlistItem.deleteMany({
      where: { userId: user.id, productId: params.productId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur /api/wishlist/[productId] (DELETE) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
