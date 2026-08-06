"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconHeart } from "@tabler/icons-react";
import { useSession } from "@/services/auth";
import { useWishlist } from "@/services/wishlist";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/animations/ProductGridSkeleton";

export default function FavorisPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: items, isLoading } = useWishlist();

  if (!sessionLoading && !session) {
    return (
      <div className="mx-auto max-w-md px-4 pb-20 pt-32 text-center">
        <p className="text-text-muted">Connectez-vous pour voir vos favoris.</p>
        <button
          onClick={() => router.push("/connexion?next=/favoris")}
          className="mt-4 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">Mes favoris</h1>

      {isLoading ? (
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <IconHeart size={32} className="text-text-muted" />
          <p className="text-text-muted">Vous n'avez pas encore d'article favori.</p>
          <Link
            href="/boutique"
            className="mt-2 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.productId}
              product={{
                id: item.productId,
                slug: item.slug,
                name: item.name,
                brand: item.brand,
                category: "sneakers",
                gender: "homme",
                usage: "streetwear",
                basePrice: item.basePrice,
                compareAtPrice: item.compareAtPrice,
                imageUrl: item.imageUrl ?? "/images/placeholder.jpg",
                isNew: false,
                avgRating: item.avgRating,
                colors: [],
                availableSizes: [],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
