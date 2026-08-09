import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

const createProductSchema = z.object({
  name: z.string().min(2),
  brandId: z.string(),
  categoryIds: z.array(z.string()).min(1),
  gender: z.enum(["HOMME", "FEMME", "ENFANT", "UNISEXE"]),
  usage: z.enum(["RUNNING", "STREETWEAR", "TRAINING", "VILLE", "SPORT"]).optional(),
  description: z.string().min(10),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().optional(),
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

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-5)}`
  );
}

export async function GET() {
  const admin = await requireSection("produits");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const products = await prisma.product.findMany({
    include: { brand: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireSection("produits");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const slug = slugify(data.name);

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        name: data.name,
        slug,
        sku: `YV-${slug.toUpperCase()}`,
        brandId: data.brandId,
        gender: data.gender,
        usage: data.usage,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice,
        isPublished: true,
        categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
        images: {
          create: [
            { url: `https://picsum.photos/seed/${slug}-1/800/800`, angle: "Face", position: 0 },
            { url: `https://picsum.photos/seed/${slug}-2/800/800`, angle: "Profil", position: 1 },
          ],
        },
      },
    });

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
      await tx.variant.create({
        data: { productId: created.id, sizeId: size.id, colorId: color.id, stock: v.stock },
      });
    }

    await tx.auditLog.create({
      data: { userId: admin.id, action: "product.create", entity: "Product", entityId: created.id },
    });

    return created;
  });

  return NextResponse.json({ product }, { status: 201 });
}
