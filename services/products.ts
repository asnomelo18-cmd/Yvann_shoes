import { useQuery } from "@tanstack/react-query";
import type { BoutiqueFilters } from "@/components/product/FilterPanel";
import type { SortValue } from "@/components/product/SortSelect";

export interface ApiProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  basePrice: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  isNew: boolean;
  avgRating: number;
  colors: { id: string; name: string; hexCode: string }[];
  availableSizes: number[];
}

export interface ApiProductDetail {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  materials: string | null;
  careInstructions: string | null;
  weightGrams: number | null;
  drop: number | null;
  soleType: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  avgRating: number;
  images: { url: string; angle: string | null }[];
  colors: { id: string; name: string; hexCode: string }[];
  sizes: { id: string; eu: number; available: boolean }[];
  variants: { id: string; sizeEu: number; colorName: string; stock: number }[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    title: string | null;
    comment: string | null;
    verifiedPurchase: boolean;
    date: string;
  }[];
}

function buildProductsQuery(filters: BoutiqueFilters, sort: SortValue, page: number) {
  const params = new URLSearchParams();
  filters.brands.forEach((b) => params.append("brand", b));
  filters.categories.forEach((c) => params.append("category", c));
  filters.sizes.forEach((s) => params.append("size", s));
  filters.colors.forEach((c) => params.append("color", c));
  if (filters.priceRange[0] > 0) params.set("minPrice", String(filters.priceRange[0]));
  if (filters.priceRange[1] < 100000) params.set("maxPrice", String(filters.priceRange[1]));
  params.set("sort", sort);
  params.set("page", String(page));
  return params.toString();
}

export async function fetchProducts(filters: BoutiqueFilters, sort: SortValue, page: number) {
  const res = await fetch(`/api/products?${buildProductsQuery(filters, sort, page)}`);
  if (!res.ok) throw new Error("Impossible de charger les produits.");
  return res.json() as Promise<{
    products: ApiProductSummary[];
    pagination: { page: number; pageSize: number; total: number; totalPages: number };
  }>;
}

export function useProducts(filters: BoutiqueFilters, sort: SortValue, page: number) {
  return useQuery({
    queryKey: ["products", filters, sort, page],
    queryFn: () => fetchProducts(filters, sort, page),
  });
}

export async function fetchProduct(slug: string) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error("Produit introuvable.");
  const data = await res.json();
  return data.product as ApiProductDetail;
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });
}
