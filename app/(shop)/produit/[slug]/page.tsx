"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  IconStar,
  IconHeart,
  IconGitCompare,
  IconShare,
  IconMinus,
  IconPlus,
  IconShoppingBagPlus,
} from "@tabler/icons-react";
import { GlassTag } from "@/components/shared/GlassTag";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SizeSelector } from "@/components/product/SizeSelector";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { useProduct } from "@/services/products";
import { useIsWishlisted, useToggleWishlist } from "@/services/wishlist";
import { useIsCompared, useToggleCompare } from "@/services/compare";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(params.slug);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isFavorite = useIsWishlisted(product?.id ?? "");
  const { add: addToWishlist, remove: removeFromWishlist } = useToggleWishlist();
  const isCompared = useIsCompared(product?.id ?? "");
  const { add: addToCompare, remove: removeFromCompare } = useToggleCompare();

  const addLine = useCartStore((s) => s.addLine);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    if (product && !selectedColor) setSelectedColor(product.colors[0]?.name ?? "");
  }, [product, selectedColor]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) return notFound();

  const discountPct = product.compareAtPrice
    ? Math.round((1 - product.basePrice / product.compareAtPrice) * 100)
    : null;

  function handleAddToCart() {
    if (!selectedSize) {
      toast.error("Choisissez une pointure avant d'ajouter au panier.");
      return;
    }
    const variant = product!.variants.find(
      (v) => v.sizeEu === selectedSize && v.colorName === selectedColor
    );
    if (!variant || variant.stock < quantity) {
      toast.error("Cette combinaison pointure/couleur n'est plus disponible en stock.");
      return;
    }
    addLine({
      productId: product!.id,
      variantId: variant.id,
      name: product!.name,
      imageUrl: product!.images[0]?.url ?? "",
      size: String(selectedSize),
      color: selectedColor,
      unitPrice: product!.basePrice,
      quantity,
    });
    toast.success(`${product!.name} ajouté au panier.`);
    openCart();
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product!.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images.map((img) => ({ url: img.url, angle: img.angle ?? "Vue" }))}
        />

        <div>
          <p className="text-sm text-text-muted">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <IconStar size={15} className="fill-yvann-warning text-yvann-warning" />
              {product.avgRating.toFixed(1)} ({product.reviews.length} avis)
            </span>
            <span>·</span>
            <span>Réf. {product.sku}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-text">{formatPrice(product.basePrice)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-text-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-yvann-danger px-2 py-0.5 text-xs font-semibold text-white">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold text-text">
              Couleur — <span className="font-normal text-text-muted">{selectedColor}</span>
            </h3>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <GlassTag
                  key={c.id}
                  label={c.name}
                  swatchColor={c.hexCode}
                  selected={selectedColor === c.name}
                  onToggle={() => setSelectedColor(c.name)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <SizeSelector
              availableSizes={product.sizes.filter((s) => s.available).map((s) => s.eu)}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <h3 className="text-sm font-semibold text-text">Quantité</h3>
            <div className="flex items-center gap-3 rounded-full border border-slate-300 px-2 py-1 dark:border-slate-700">
              <button
                aria-label="Diminuer"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-text"
              >
                <IconMinus size={14} />
              </button>
              <span className="w-4 text-center text-sm text-text">{quantity}</span>
              <button
                aria-label="Augmenter"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-text"
              >
                <IconPlus size={14} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-yvann-gold-700"
            >
              <IconShoppingBagPlus size={17} /> Ajouter au panier
            </button>
            <button className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-text dark:border-slate-700">
              Acheter maintenant
            </button>
            <button
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              onClick={() => {
                if (!product) return;
                if (isFavorite) {
                  removeFromWishlist.mutate(product.id);
                } else {
                  addToWishlist.mutate(product.id, {
                    onSuccess: () => toast.success("Ajouté à vos favoris."),
                    onError: () => toast.error("Connectez-vous pour ajouter aux favoris."),
                  });
                }
              }}
              className={`rounded-full border p-3 ${isFavorite ? "border-yvann-danger text-yvann-danger" : "border-slate-300 text-text dark:border-slate-700"}`}
            >
              <IconHeart size={18} className={isFavorite ? "fill-yvann-danger" : ""} />
            </button>
            <button
              aria-label={isCompared ? "Retirer du comparateur" : "Ajouter au comparateur"}
              onClick={() => {
                if (!product) return;
                if (isCompared) {
                  removeFromCompare.mutate(product.id);
                } else {
                  addToCompare.mutate(product.id, {
                    onSuccess: () => toast.success("Ajouté au comparateur."),
                    onError: (error) =>
                      toast.error(error instanceof Error ? error.message : "Ajout impossible."),
                  });
                }
              }}
              className={`rounded-full border p-3 ${isCompared ? "border-yvann-gold-600 text-yvann-gold-600" : "border-slate-300 text-text dark:border-slate-700"}`}
            >
              <IconGitCompare size={18} />
            </button>
            <button
              aria-label="Partager"
              onClick={handleShare}
              className="rounded-full border border-slate-300 p-3 text-text dark:border-slate-700"
            >
              <IconShare size={18} />
            </button>
          </div>

          <div className="mt-10 space-y-3 border-t border-slate-200 pt-6 text-sm text-text-muted dark:border-slate-800">
            <p>{product.description}</p>
            {product.materials && <p>{product.materials}</p>}
          </div>
        </div>
      </div>

      <ReviewsSection
        avgRating={product.avgRating}
        reviewCount={product.reviews.length}
        reviews={product.reviews.map((r) => ({
          id: r.id,
          author: r.author,
          rating: r.rating,
          title: r.title ?? "",
          comment: r.comment ?? "",
          verifiedPurchase: r.verifiedPurchase,
          date: r.date,
        }))}
      />
    </div>
  );
}
