import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET() {
  const admin = await requireSection("contenu");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-5)}`
  );
}

const createSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  coverUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  const admin = await requireSection("contenu");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });

  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug: slugify(parsed.data.title),
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      coverUrl: parsed.data.coverUrl || null,
      isPublished: parsed.data.isPublished ?? false,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
