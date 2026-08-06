"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
}

export default function AdminContenuPage() {
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
                      b.isActive ? "bg-yvann-success/15 text-yvann-success" : "bg-slate-400/15 text-text-muted"
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
