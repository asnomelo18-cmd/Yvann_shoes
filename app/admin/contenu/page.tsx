"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
}

function BannersManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", imageUrl: "", linkUrl: "", position: "home-hero-secondary" });

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const res = await fetch("/api/admin/banners");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.banners as Banner[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, linkUrl: form.linkUrl || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Création impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      setForm({ title: "", imageUrl: "", linkUrl: "", position: "home-hero-secondary" });
      toast.success("Bannière créée.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "banners"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("Bannière supprimée.");
    },
  });

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h3 className="mb-4 text-sm font-semibold text-text">Nouvelle bannière</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.title && form.imageUrl) create.mutate();
          }}
          className="grid grid-cols-2 gap-4"
        >
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Titre"
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          <input
            required
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="URL de l'image"
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          <input
            value={form.linkUrl}
            onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
            placeholder="Lien (optionnel)"
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          <select
            value={form.position}
            onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          >
            <option value="home-hero-secondary">Accueil — bannière secondaire</option>
            <option value="category-top">Haut de catégorie</option>
          </select>
          <button
            type="submit"
            disabled={create.isPending}
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-yvann-gold-600 px-4 py-2.5 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
          >
            <IconPlus size={16} /> Créer
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-text-muted">Chargement...</p>
        ) : !banners || banners.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 py-10 text-center text-text-muted dark:border-slate-700">
            Aucune bannière pour l'instant.
          </p>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="aspect-video bg-surface-2">
                <img src={b.imageUrl} alt={b.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-text">{b.title}</p>
                <p className="text-xs text-text-muted">{b.position}</p>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => toggleActive.mutate({ id: b.id, isActive: !b.isActive })}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      b.isActive ? "bg-yvann-success/15 text-yvann-successText" : "bg-slate-400/15 text-text-muted"
                    )}
                  >
                    {b.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => remove.mutate(b.id)}
                    className="rounded-full p-1.5 text-text-muted hover:text-yvann-danger"
                    aria-label="Supprimer"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  isPublished: boolean;
}

const EMPTY_POST_FORM = { title: "", excerpt: "", content: "", coverUrl: "", isPublished: false };

function BlogManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_POST_FORM);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.posts as BlogPost[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, coverUrl: form.coverUrl || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Création impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
      setShowForm(false);
      toast.success("Article créé.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  const update = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/blog/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, coverUrl: form.coverUrl || "" }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
      setShowForm(false);
      toast.success("Article mis à jour.");
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
      toast.success("Article supprimé.");
    },
  });

  function openNew() {
    setForm(EMPTY_POST_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverUrl: post.coverUrl ?? "",
      isPublished: post.isPublished,
    });
    setEditingId(post.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Titre et contenu requis.");
      return;
    }
    if (editingId) update.mutate();
    else create.mutate();
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-full bg-yvann-gold-600 px-4 py-2 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          <IconPlus size={16} /> Nouvel article
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-text-muted">Chargement...</p>
        ) : !posts || posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-text-muted dark:border-slate-700">
            Aucun article pour l'instant.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div>
                <p className="text-sm font-medium text-text">{post.title}</p>
                {post.excerpt && <p className="text-xs text-text-muted">{post.excerpt}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => togglePublish.mutate({ id: post.id, isPublished: !post.isPublished })}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    post.isPublished ? "bg-yvann-success/15 text-yvann-successText" : "bg-slate-400/15 text-text-muted"
                  )}
                >
                  {post.isPublished ? "Publié" : "Brouillon"}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="rounded-full p-1.5 text-text-muted hover:text-yvann-gold-700"
                  aria-label="Modifier"
                >
                  <IconEdit size={15} />
                </button>
                <button
                  onClick={() => remove.mutate(post.id)}
                  className="rounded-full p-1.5 text-text-muted hover:text-yvann-danger"
                  aria-label="Supprimer"
                >
                  <IconTrash size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">
              {editingId ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                required
                placeholder="Titre"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                placeholder="Résumé court (optionnel)"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <input
                placeholder="URL de l'image de couverture (optionnel)"
                value={form.coverUrl}
                onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <textarea
                required
                rows={8}
                placeholder="Contenu de l'article"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
              />
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="h-4 w-4 accent-yvann-gold-600"
                />
                Publier immédiatement
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={create.isPending || update.isPending}
                  className="rounded-full bg-yvann-gold-600 px-6 py-2.5 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
                >
                  {editingId ? "Enregistrer" : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-text dark:border-slate-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminContenuPage() {
  return (
    <Tabs.Root defaultValue="bannieres">
      <Tabs.List className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { value: "bannieres", label: "Bannières" },
          { value: "blog", label: "Articles de blog" },
        ].map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "border-b-2 border-transparent px-3 pb-3 text-sm font-medium text-text-muted",
              "data-[state=active]:border-yvann-gold-600 data-[state=active]:text-text"
            )}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value="bannieres" className="pt-6">
        <BannersManager />
      </Tabs.Content>
      <Tabs.Content value="blog" className="pt-6">
        <BlogManager />
      </Tabs.Content>
    </Tabs.Root>
  );
}
