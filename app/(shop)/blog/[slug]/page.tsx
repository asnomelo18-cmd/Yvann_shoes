"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  publishedAt: string;
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${params.slug}`);
      if (!res.ok) throw new Error("Article introuvable.");
      const data = await res.json();
      return data.post as BlogPost;
    },
  });

  if (isLoading) {
    return <div className="mx-auto max-w-2xl px-4 pb-20 pt-28 text-text-muted">Chargement...</div>;
  }
  if (isError || !post) return notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <Link href="/blog" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} /> Retour au blog
      </Link>

      <p className="mt-6 text-xs text-text-muted">
        {new Date(post.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text">{post.title}</h1>

      {post.coverUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-surface-2">
          <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-text-muted">
        {post.content.split("\n").filter(Boolean).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
