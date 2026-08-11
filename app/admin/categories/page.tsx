"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

function useEntityList(entity: "brands" | "categories") {
  return useQuery({
    queryKey: ["admin", entity],
    queryFn: async () => {
      const res = await fetch(`/api/admin/${entity}`);
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return (data[entity === "brands" ? "brands" : "categories"] as Item[]) ?? [];
    },
  });
}

function EntityManager({ entity, label }: { entity: "brands" | "categories"; label: string }) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useEntityList(entity);

  const create = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/admin/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Création impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", entity] });
      setName("");
      toast.success(`${label.slice(0, -1)} créée.`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/${entity}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Suppression impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", entity] });
      toast.success("Supprimée.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) {
            toast.error("Indique un nom avant d'ajouter.");
            return;
          }
          create.mutate(name.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Nom de la ${label.slice(0, -1).toLowerCase()}...`}
          className="flex-1 rounded-full border border-slate-300 bg-transparent px-4 py-2 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="flex items-center gap-1.5 rounded-full bg-yvann-gold-600 px-4 py-2 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
        >
          <IconPlus size={16} /> Ajouter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Produits</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : !items || items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  Aucune entrée pour l'instant.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="text-text">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-text-muted">{item.slug}</td>
                  <td className="px-4 py-3 text-text-muted">{item._count.products}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove.mutate(item.id)}
                      className="rounded-full p-1.5 text-text-muted hover:text-yvann-danger"
                      aria-label="Supprimer"
                    >
                      <IconTrash size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Tabs.Root defaultValue="marques">
      <Tabs.List className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { value: "marques", label: "Marques" },
          { value: "categories", label: "Catégories" },
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
      <Tabs.Content value="marques" className="pt-6">
        <EntityManager entity="brands" label="Marques" />
      </Tabs.Content>
      <Tabs.Content value="categories" className="pt-6">
        <EntityManager entity="categories" label="Catégories" />
      </Tabs.Content>
    </Tabs.Root>
  );
}
