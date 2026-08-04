import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      brand: true,
      images: { orderBy: { position: "asc" } },
      variants: { include: { size: true, color: true } },
      reviews: {
        where: { status: "approved" },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      brand: product.brand.name,
      description: product.description,
      materials: product.materials,
      careInstructions: product.careInstructions,
      weightGrams: product.weightGrams,
      drop: product.drop,
      soleType: product.soleType,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice,
      avgRating: product.avgRating,
      images: product.images.map((img) => ({ url: img.url, angle: img.angle })),
      colors: [...new Map(product.variants.map((v) => [v.color.id, v.color])).values()],
      sizes: [...new Map(product.variants.map((v) => [v.size.id, v.size])).values()].map((s) => ({
        id: s.id,
        eu: s.eu,
        available: product.variants.some((v) => v.sizeId === s.id && v.stock > 0),
      })),
      variants: product.variants.map((v) => ({
        id: v.id,
        sizeEu: v.size.eu,
        colorName: v.color.name,
        stock: v.stock,
      })),
      reviews: product.reviews.map((r) => ({
        id: r.id,
        author: `${r.user.firstName ?? ""} ${r.user.lastName?.[0] ?? ""}.`.trim(),
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verifiedPurchase: r.verifiedPurchase,
        date: r.createdAt,
      })),
    },
  });
}
