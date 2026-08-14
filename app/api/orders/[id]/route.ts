import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        payment: true,
        shippingAddress: true,
        shipment: true,
        items: { include: { product: true, variant: { include: { size: true, color: true } } } },
      },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Erreur /api/orders/[id] (GET) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
