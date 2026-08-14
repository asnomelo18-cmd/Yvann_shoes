import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10).optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("contenu");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Article introuvable." }, { status: 404 });

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      coverUrl: parsed.data.coverUrl === "" ? null : parsed.data.coverUrl,
      publishedAt:
        parsed.data.isPublished && !existing.isPublished ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("contenu");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
