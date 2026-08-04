"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch, IconPlus, IconEdit, IconAlertTriangle } from "@tabler/icons-react";
import { MOCK_PRODUCTS, BRANDS } from "@/lib/mock-products";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminProduitsPage() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string | "TOUS">("TOUS");

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (brandFilter !== "TOUS" && p.brand !== brandFilter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, brandFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 dark:border-slate-700">
            <IconSearch size={15} className="text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un modèle..."
              className="w-48 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="rounded-full border border-slate-300 bg-transparent px-3 py-2 text-sm text-text dark:border-slate-700"
          >
            <option value="TOUS">Toutes les marques</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 rounded-full bg-yvann-gold-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yvann-gold-700"
        >
          <IconPlus size={16} /> Ajouter un produit
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Pointures dispo.</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((p) => {
              const lowStock = p.availableSizes.length <= 3;
              return (
                <tr key={p.id} className="text-text">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{p.brand}</td>
                  <td className="px-4 py-3 text-text-muted capitalize">{p.category}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(p.basePrice)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                        lowStock ? "bg-yvann-warning/15 text-yvann-warning" : "bg-yvann-success/15 text-yvann-success"
                      )}
                    >
                      {lowStock && <IconAlertTriangle size={12} />}
                      {p.availableSizes.length} pointures
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        p.isNew ? "bg-yvann-bronze-500/15 text-yvann-bronze-500" : "bg-slate-400/15 text-text-muted"
                      )}
                    >
                      {p.isNew ? "Nouveau" : "Publié"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-text hover:border-yvann-gold-500 dark:border-slate-700"
                    >
                      <IconEdit size={13} /> Modifier
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
