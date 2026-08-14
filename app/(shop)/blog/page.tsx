"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IconNotes } from "@tabler/icons-react";

interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  publishedAt: string;
}

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) return [] as BlogPostSummary[];
      const data = await res.json();
      return data.posts as BlogPostSummary[];
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Blog</h1>
        <p className="mt-2 text-text-muted">Actus sneakers, guides d'entretien et nouveautés.</p>
      </div>

      {isLoading ? (
        <p className="mt-16 text-center text-text-muted">Chargement...</p>
      ) : !posts || posts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-text-muted">
          <IconNotes size={32} />
          <p className="text-sm">Les premiers articles arrivent bientôt.</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              {post.coverUrl && (
                <div className="aspect-video overflow-hidden bg-surface-2">
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-text-muted">
                  {new Date(post.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h2 className="mt-1 text-sm font-semibold text-text">{post.title}</h2>
                {post.excerpt && <p className="mt-1 text-sm text-text-muted">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
