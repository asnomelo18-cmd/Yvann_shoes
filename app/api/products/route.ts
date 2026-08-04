import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brands = searchParams.getAll("brand");
  const categories = searchParams.getAll("category");
  const sizes = searchParams.getAll("size").map(Number).filter(Boolean);
  const colors = searchParams.getAll("color");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") ?? "pertinence";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "12");

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    ...(brands.length && { brand: { slug: { in: brands } } }),
    ...(categories.length && { categories: { some: { category: { slug: { in: categories } } } } }),
    ...((minPrice || maxPrice) && {
      basePrice: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(sizes.length || colors.length
      ? {
          variants: {
            some: {
              stock: { gt: 0 },
              ...(sizes.length && { size: { eu: { in: sizes } } }),
              ...(colors.length && { color: { name: { in: colors } } }),
            },
          },
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "prix-asc"
      ? { basePrice: "asc" }
      : sort === "prix-desc"
      ? { basePrice: "desc" }
      : sort === "nouveautes"
      ? { createdAt: "desc" }
      : sort === "notes"
      ? { avgRating: "desc" }
      : { isFeatured: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        brand: true,
        images: { orderBy: { position: "asc" }, take: 1 },
        variants: { include: { size: true, color: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand.name,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      imageUrl: p.images[0]?.url ?? null,
      isNew: p.isNew,
      avgRating: p.avgRating,
      colors: [...new Map(p.variants.map((v) => [v.color.id, v.color])).values()],
      availableSizes: [...new Set(p.variants.filter((v) => v.stock > 0).map((v) => v.size.eu))],
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
