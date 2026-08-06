"use client";

import Link from "next/link";
import { toast } from "sonner";
import { IconStar, IconHeart } from "@tabler/icons-react";
import { formatPrice } from "@/lib/utils";
import { useIsWishlisted, useToggleWishlist } from "@/services/wishlist";
import type { MockProduct } from "@/lib/mock-products";

export function ProductCard({ product, view = "grid" }: { product: MockProduct; view?: "grid" | "list" }) {
  const discountPct = product.compareAtPrice
    ? Math.round((1 - product.basePrice / product.compareAtPrice) * 100)
    : null;

  const isWishlisted = useIsWishlisted(product.id);
  const { add, remove } = useToggleWishlist();

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (isWishlisted) {
      remove.mutate(product.id);
    } else {
      add.mutate(product.id, {
        onError: () => toast.error("Connectez-vous pour ajouter aux favoris."),
      });
    }
  }

  return (
    <Link
      href={`/produit/${product.slug}`}
      className={
        view === "grid"
          ? "group block"
          : "group flex items-center gap-4 rounded-2xl border border-slate-200 p-3 dark:border-slate-800"
      }
    >
      <div
        className={
          view === "grid"
            ? "relative aspect-square overflow-hidden rounded-2xl bg-surface-2"
            : "relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2"
        }
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-yvann-bronze-500 px-2 py-0.5 text-[11px] font-semibold text-yvann-black-950">
              Nouveau
            </span>
          )}
          {discountPct && (
            <span className="rounded-full bg-yvann-danger px-2 py-0.5 text-[11px] font-semibold text-white">
              -{discountPct}%
            </span>
          )}
        </div>
        <button
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={handleToggleWishlist}
          className={`absolute right-2 top-2 rounded-full p-1.5 transition-opacity ${
            isWishlisted ? "bg-white/90 opacity-100" : "bg-white/90 opacity-0 group-hover:opacity-100"
          }`}
        >
          <IconHeart
            size={16}
            className={isWishlisted ? "fill-yvann-danger text-yvann-danger" : "text-yvann-black-950"}
          />
        </button>
      </div>

      <div className={view === "grid" ? "mt-3" : "flex-1"}>
        <p className="text-xs text-text-muted">{product.brand}</p>
        <h3 className="text-sm font-medium text-text">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
          <IconStar size={13} className="fill-yvann-warning text-yvann-warning" />
          {product.avgRating.toFixed(1)}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-text">
            {formatPrice(product.basePrice)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="mt-2 flex gap-1">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
