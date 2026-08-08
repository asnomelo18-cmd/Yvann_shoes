"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
}

export default function AdminPromotionsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.coupons as Coupon[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          description: form.description || undefined,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Création impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      setForm({ code: "", description: "", discountType: "percentage", discountValue: "" });
      toast.success("Coupon créé.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon supprimé.");
    },
  });

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h3 className="mb-4 text-sm font-semibold text-text">Nouveau coupon</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.code && form.discountValue) create.mutate();
          }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <input
            required
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            placeholder="CODE"
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as "percentage" | "fixed" }))}
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          >
            <option value="percentage">Pourcentage (%)</option>
            <option value="fixed">Montant fixe (XOF)</option>
          </select>
          <input
            required
            type="number"
            value={form.discountValue}
            onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
            placeholder="Valeur"
            className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
          />
          <button
            type="submit"
            disabled={create.isPending}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-yvann-gold-600 px-4 py-2.5 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
          >
            <IconPlus size={16} /> Créer
          </button>
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description (optionnel)"
            className="col-span-2 rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700 sm:col-span-4"
          />
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Réduction</th>
              <th className="px-4 py-3">Utilisations</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : !coupons || coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  Aucun coupon pour l'instant.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="text-text">
                  <td className="px-4 py-3 font-medium">{c.code}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {c.discountType === "percentage" ? `${c.discountValue}%` : `${c.discountValue} XOF`}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {c.usedCount}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive.mutate({ id: c.id, isActive: !c.isActive })}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        c.isActive ? "bg-yvann-success/15 text-yvann-successText" : "bg-slate-400/15 text-text-muted"
                      )}
                    >
                      {c.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove.mutate(c.id)}
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
