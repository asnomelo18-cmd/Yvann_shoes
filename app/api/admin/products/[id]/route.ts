import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("produits");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      brand: true,
      categories: { include: { category: true } },
      variants: { include: { size: true, color: true } },
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  return NextResponse.json({ product });
}

const updateProductSchema = z.object({
  name: z.string().min(2),
  brandId: z.string(),
  categoryIds: z.array(z.string()).min(1),
  gender: z.enum(["HOMME", "FEMME", "ENFANT", "UNISEXE"]),
  usage: z.enum(["RUNNING", "STREETWEAR", "TRAINING", "VILLE", "SPORT"]).optional(),
  description: z.string().min(10),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().optional().nullable(),
  isPublished: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        sizeEu: z.number(),
        colorName: z.string(),
        stock: z.number().int().nonnegative(),
      })
    )
    .min(1),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("produits");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        brandId: data.brandId,
        gender: data.gender,
        usage: data.usage,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice ?? null,
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });

    // Réaligne les catégories
    await tx.productCategory.deleteMany({ where: { productId: params.id } });
    await tx.productCategory.createMany({
      data: data.categoryIds.map((categoryId) => ({ productId: params.id, categoryId })),
    });

    // Upsert des variantes (pointure × coloris) — le stock est mis à jour, pas recréé
    for (const v of data.variants) {
      const size = await tx.size.upsert({
        where: { eu: v.sizeEu },
        update: {},
        create: { eu: v.sizeEu },
      });
      const color = await tx.color.upsert({
        where: { name: v.colorName },
        update: {},
        create: { name: v.colorName, hexCode: "#5C5C63" },
      });
      await tx.variant.upsert({
        where: {
          productId_sizeId_colorId: { productId: params.id, sizeId: size.id, colorId: color.id },
        },
        update: { stock: v.stock },
        create: { productId: params.id, sizeId: size.id, colorId: color.id, stock: v.stock },
      });
    }

    await tx.auditLog.create({
      data: { userId: admin.id, action: "product.update", entity: "Product", entityId: params.id },
    });

    return updated;
  });

  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("produits");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.product.delete({ where: { id: params.id } });

  await prisma.auditLog.create({
    data: { userId: admin.id, action: "product.delete", entity: "Product", entityId: params.id },
  });

  return NextResponse.json({ ok: true });
}
