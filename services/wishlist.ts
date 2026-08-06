import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  basePrice: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  avgRating: number;
}

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return [] as WishlistItem[];
      const data = await res.json();
      return data.items as WishlistItem[];
    },
  });
}

export function useIsWishlisted(productId: string) {
  const { data } = useWishlist();
  return !!data?.some((item) => item.productId === productId);
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Connectez-vous pour ajouter aux favoris.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const remove = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  return { add, remove };
}
