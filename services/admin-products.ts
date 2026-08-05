import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AdminProductVariant {
  id?: string;
  sizeEu: number;
  colorName: string;
  stock: number;
}

export interface AdminProductInput {
  name: string;
  brandId: string;
  categoryIds: string[];
  gender: "HOMME" | "FEMME" | "ENFANT" | "UNISEXE";
  usage?: "RUNNING" | "STREETWEAR" | "TRAINING" | "VILLE" | "SPORT";
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  variants: AdminProductVariant[];
}

export function useAdminMeta() {
  return useQuery({
    queryKey: ["admin", "meta"],
    queryFn: async () => {
      const res = await fetch("/api/admin/meta");
      if (!res.ok) throw new Error("Impossible de charger les marques/catégories.");
      return res.json() as Promise<{
        brands: { id: string; name: string; slug: string }[];
        categories: { id: string; name: string; slug: string }[];
      }>;
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Impossible de charger les produits.");
      const data = await res.json();
      return data.products as any[];
    },
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/products/${id}`);
      if (!res.ok) throw new Error("Produit introuvable.");
      const data = await res.json();
      return data.product as any;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminProductInput) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Création impossible.");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminProductInput) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Mise à jour impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}
