import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const reviews = await prisma.review.findMany({
    where: status ? { status } : undefined,
    include: { user: true, product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      productName: r.product.name,
      productSlug: r.product.slug,
      customerName: `${r.user.firstName ?? ""} ${r.user.lastName ?? ""}`.trim(),
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verifiedPurchase: r.verifiedPurchase,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}
