import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  address: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(2),
  }),
  deliveryMethod: z.enum(["standard", "express"]),
  payment: z.object({
    method: z.enum(["ORANGE_MONEY", "MTN_MONEY", "WAVE", "VIREMENT", "ESPECES"]),
    transactionReference: z.string().optional(),
  }),
});

const SHIPPING_PRICE = { standard: 2500, express: 6000 };

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise pour commander." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items, address, deliveryMethod, payment } = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Vérifie et décrémente le stock de chaque variante commandée
      const variants = await tx.variant.findMany({
        where: { id: { in: items.map((i) => i.variantId) } },
      });

      for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour la variante ${item.variantId}`);
        }
      }

      for (const item of items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
        await tx.stockMovement.create({
          data: { variantId: item.variantId, quantity: -item.quantity, reason: "sale" },
        });
      }

      const shippingAddress = await tx.address.create({
        data: { userId: user.id, ...address },
      });

      const subtotal = variants.reduce((sum, v) => {
        const item = items.find((i) => i.variantId === v.id)!;
        const price = Number(v.priceOverride ?? 0) || 0;
        return sum + price * item.quantity;
      }, 0);

      // Le prix réel vient du Product.basePrice (priceOverride est l'exception)
      const products = await tx.product.findMany({
        where: { id: { in: variants.map((v) => v.productId) } },
      });
      const computedSubtotal = items.reduce((sum, item) => {
        const variant = variants.find((v) => v.id === item.variantId)!;
        const product = products.find((p) => p.id === variant.productId)!;
        const unitPrice = Number(variant.priceOverride ?? product.basePrice);
        return sum + unitPrice * item.quantity;
      }, 0);

      const shippingCost = SHIPPING_PRICE[deliveryMethod];
      const total = computedSubtotal + shippingCost;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: `RHO-${Date.now().toString().slice(-8)}`,
          userId: user.id,
          status: "EN_ATTENTE",
          shippingAddressId: shippingAddress.id,
          billingAddressId: shippingAddress.id,
          subtotal: computedSubtotal,
          shippingCost,
          total,
          items: {
            create: items.map((item) => {
              const variant = variants.find((v) => v.id === item.variantId)!;
              const product = products.find((p) => p.id === variant.productId)!;
              return {
                productId: variant.productId,
                variantId: variant.id,
                quantity: item.quantity,
                unitPrice: Number(variant.priceOverride ?? product.basePrice),
              };
            }),
          },
          payment: {
            create: {
              method: payment.method,
              amount: total,
              transactionReference: payment.transactionReference,
              status: "EN_ATTENTE",
            },
          },
        },
        include: { items: true, payment: true },
      });

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la commande.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
