import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CompareItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  basePrice: number;
  weightGrams: number | null;
  drop: number | null;
  soleType: string | null;
  usage: string | null;
  gender: string;
  avgRating: number;
}

export function useCompareList() {
  return useQuery({
    queryKey: ["compare"],
    queryFn: async () => {
      const res = await fetch("/api/compare");
      if (!res.ok) return [] as CompareItem[];
      const data = await res.json();
      return data.items as CompareItem[];
    },
  });
}

export function useIsCompared(productId: string) {
  const { data } = useCompareList();
  return !!data?.some((item) => item.productId === productId);
}

export function useToggleCompare() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Ajout impossible.");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["compare"] }),
  });

  const remove = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/compare/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["compare"] }),
  });

  return { add, remove };
}
