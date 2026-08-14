import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { getShopSettings } from "@/lib/settings";
import { InvoiceDocument } from "@/lib/invoice-pdf";

const STAFF_ROLES = ["ADMIN", "MANAGER", "SUPPORT", "VENDEUR"];

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        payment: true,
        shippingAddress: true,
        items: { include: { product: true, variant: { include: { size: true, color: true } } } },
      },
    });

    if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    if (order.userId !== user.id && !STAFF_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const settings = await getShopSettings();

    const pdfBuffer = await renderToBuffer(
      InvoiceDocument({
        order: {
          orderNumber: order.orderNumber,
          createdAt: order.createdAt.toISOString(),
          subtotal: Number(order.subtotal),
          shippingCost: Number(order.shippingCost),
          discountAmount: Number(order.discountAmount),
          total: Number(order.total),
          currency: order.currency,
          items: order.items.map((item) => ({
            name: item.product.name,
            size: item.variant.size.eu,
            color: item.variant.color.name,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          })),
          customerName: `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim(),
          customerEmail: order.user.email,
          shippingAddress: {
            fullName: order.shippingAddress.fullName,
            line1: order.shippingAddress.line1,
            line2: order.shippingAddress.line2,
            city: order.shippingAddress.city,
            country: order.shippingAddress.country,
          },
          paymentMethod: order.payment?.method ?? null,
        },
        shop: {
          name: settings.shopName,
          legalName: settings.legalName,
          email: settings.email,
          phone: settings.phone,
        },
      })
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="facture-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur /api/orders/[id]/invoice :", error);
    return NextResponse.json({ error: "Impossible de générer la facture." }, { status: 500 });
  }
}
