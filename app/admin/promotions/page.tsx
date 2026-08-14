"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { cn, formatPrice } from "@/lib/utils";

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

function CouponsManager() {
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

interface FlashSaleItem {
  productId: string;
  discountPct: number;
  product: { name: string };
}
interface FlashSale {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  items: FlashSaleItem[];
}
interface SimpleProduct {
  id: string;
  name: string;
  basePrice: number;
}

function flashSaleStatus(sale: FlashSale) {
  const now = Date.now();
  const start = new Date(sale.startsAt).getTime();
  const end = new Date(sale.endsAt).getTime();
  if (now < start) return { label: "À venir", tone: "bg-yvann-gold-500/15 text-yvann-gold-700" };
  if (now > end) return { label: "Terminée", tone: "bg-slate-400/15 text-text-muted" };
  return { label: "Active", tone: "bg-yvann-success/15 text-yvann-successText" };
}

function FlashSalesManager() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [selected, setSelected] = useState<Record<string, number>>({});

  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["admin", "flash-sales"],
    queryFn: async () => {
      const res = await fetch("/api/admin/flash-sales");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.flashSales as FlashSale[];
    },
  });

  const { data: products } = useQuery({
    queryKey: ["public-products-for-flashsale"],
    queryFn: async () => {
      const res = await fetch("/api/products?pageSize=100");
      if (!res.ok) return [] as SimpleProduct[];
      const data = await res.json();
      return data.products as SimpleProduct[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const items = Object.entries(selected).map(([productId, discountPct]) => ({ productId, discountPct }));
      const res = await fetch("/api/admin/flash-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, startsAt, endsAt, items }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Création impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flash-sales"] });
      setName("");
      setStartsAt("");
      setEndsAt("");
      setSelected({});
      toast.success("Vente flash créée.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/flash-sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flash-sales"] });
      toast.success("Vente flash supprimée.");
    },
  });

  function toggleProduct(id: string) {
    setSelected((s) => {
      const next = { ...s };
      if (id in next) delete next[id];
      else next[id] = 20;
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !startsAt || !endsAt) {
      toast.error("Remplis le nom et les dates.");
      return;
    }
    if (Object.keys(selected).length === 0) {
      toast.error("Sélectionne au moins un produit.");
      return;
    }
    create.mutate();
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h3 className="mb-4 text-sm font-semibold text-text">Nouvelle vente flash</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom (ex. Vente flash weekend)"
              className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">
              Produits concernés ({Object.keys(selected).length} sélectionné(s))
            </p>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2 dark:border-slate-800">
              {(products ?? []).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-2"
                >
                  <label className="flex flex-1 items-center gap-2 text-sm text-text">
                    <input
                      type="checkbox"
                      checked={p.id in selected}
                      onChange={() => toggleProduct(p.id)}
                      className="h-4 w-4 accent-yvann-gold-600"
                    />
                    {p.name} <span className="text-xs text-text-muted">({formatPrice(p.basePrice)})</span>
                  </label>
                  {p.id in selected && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={selected[p.id]}
                        onChange={(e) =>
                          setSelected((s) => ({ ...s, [p.id]: Number(e.target.value) }))
                        }
                        className="w-16 rounded-lg border border-slate-300 bg-transparent px-2 py-1 text-center text-sm text-text focus:outline-none dark:border-slate-700"
                      />
                      <span className="text-xs text-text-muted">%</span>
                    </div>
                  )}
                </div>
              ))}
              {(!products || products.length === 0) && (
                <p className="p-2 text-sm text-text-muted">Aucun produit publié pour l'instant.</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={create.isPending}
            className="flex items-center gap-1.5 rounded-full bg-yvann-gold-600 px-6 py-2.5 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
          >
            <IconPlus size={16} /> Créer la vente flash
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-text-muted">Chargement...</p>
        ) : !flashSales || flashSales.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-text-muted dark:border-slate-700">
            Aucune vente flash pour l'instant.
          </p>
        ) : (
          flashSales.map((sale) => {
            const status = flashSaleStatus(sale);
            return (
              <div key={sale.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text">{sale.name}</p>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", status.tone)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      Du {new Date(sale.startsAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}{" "}
                      au {new Date(sale.endsAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                  <button
                    onClick={() => remove.mutate(sale.id)}
                    className="rounded-full p-1.5 text-text-muted hover:text-yvann-danger"
                    aria-label="Supprimer"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sale.items.map((item) => (
                    <span
                      key={item.productId}
                      className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-text-muted"
                    >
                      {item.product.name} · -{item.discountPct}%
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function AdminPromotionsPage() {
  return (
    <Tabs.Root defaultValue="coupons">
      <Tabs.List className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { value: "coupons", label: "Coupons" },
          { value: "flash-sales", label: "Ventes flash" },
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
      <Tabs.Content value="coupons" className="pt-6">
        <CouponsManager />
      </Tabs.Content>
      <Tabs.Content value="flash-sales" className="pt-6">
        <FlashSalesManager />
      </Tabs.Content>
    </Tabs.Root>
  );
}
