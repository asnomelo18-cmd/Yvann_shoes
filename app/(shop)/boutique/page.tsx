"use client";

import { useState } from "react";
import { IconLayoutGrid, IconList, IconFilter, IconX } from "@tabler/icons-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/animations/ProductGridSkeleton";
import { FilterPanel, DEFAULT_FILTERS, type BoutiqueFilters } from "@/components/product/FilterPanel";
import { SortSelect, type SortValue } from "@/components/product/SortSelect";
import { useProducts } from "@/services/products";

export default function BoutiquePage() {
  const [filters, setFilters] = useState<BoutiqueFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortValue>("pertinence");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading, isError } = useProducts(filters, sort, page);
  const products = data?.products ?? [];
  const total = data?.pagination.total ?? 0;
  const hasMore = data ? page < data.pagination.totalPages : false;

  function updateFilters(f: BoutiqueFilters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text">Boutique</h1>
          <p className="mt-1 text-sm text-text-muted">
            {isLoading ? "Chargement..." : `${total} paires trouvées`}
          </p>
        </div>
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterPanel filters={filters} onChange={updateFilters} />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-text dark:border-slate-700 lg:hidden"
            >
              <IconFilter size={16} /> Filtres
            </button>

            <div className="ml-auto flex items-center gap-3">
              <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
              <div className="hidden items-center gap-1 rounded-full border border-slate-300 p-1 dark:border-slate-700 sm:flex">
                <button
                  aria-label="Vue grille"
                  onClick={() => setView("grid")}
                  className={`rounded-full p-1.5 ${view === "grid" ? "bg-yvann-gold-600 text-yvann-black-950" : "text-text-muted"}`}
                >
                  <IconLayoutGrid size={16} />
                </button>
                <button
                  aria-label="Vue liste"
                  onClick={() => setView("list")}
                  className={`rounded-full p-1.5 ${view === "list" ? "bg-yvann-gold-600 text-yvann-black-950" : "text-text-muted"}`}
                >
                  <IconList size={16} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center text-text-muted dark:border-slate-700">
              Impossible de charger les produits pour le moment.
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center text-text-muted dark:border-slate-700">
              Aucune paire ne correspond à ces filtres.
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
                  : "flex flex-col gap-3"
              }
            >
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  view={view}
                  product={{
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    brand: p.brand,
                    category: "sneakers",
                    gender: "homme",
                    usage: "streetwear",
                    basePrice: p.basePrice,
                    compareAtPrice: p.compareAtPrice,
                    imageUrl: p.imageUrl ?? "/images/placeholder.jpg",
                    isNew: p.isNew,
                    avgRating: p.avgRating,
                    colors: p.colors.map((c) => ({ name: c.name, hex: c.hexCode })),
                    availableSizes: p.availableSizes,
                  }}
                />
              ))}
            </div>
          )}

          {!isLoading && hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-text hover:border-yvann-gold-500 dark:border-slate-700"
              >
                Voir plus
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-bg p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Filtres</h2>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fermer">
                <IconX size={20} className="text-text" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={updateFilters} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full rounded-full bg-yvann-gold-600 py-3 text-sm font-semibold text-yvann-black-950"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
