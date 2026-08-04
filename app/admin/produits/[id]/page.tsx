import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export default function EditProduitPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-text">Modifier « {product.name} »</h2>
      <ProductForm initialProduct={product} />
    </div>
  );
}
