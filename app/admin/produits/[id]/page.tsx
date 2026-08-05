"use client";

import { useParams, notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminProduct } from "@/services/admin-products";

export default function EditProduitPage() {
  const params = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useAdminProduct(params.id);

  if (isLoading) {
    return <div className="text-text-muted">Chargement...</div>;
  }
  if (isError || !product) return notFound();

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-text">Modifier « {product.name} »</h2>
      <ProductForm
        initialProduct={{
          id: product.id,
          name: product.name,
          brandId: product.brandId,
          gender: product.gender,
          usage: product.usage,
          description: product.description,
          basePrice: Number(product.basePrice),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          categories: product.categories,
          variants: product.variants,
        }}
      />
    </div>
  );
}
