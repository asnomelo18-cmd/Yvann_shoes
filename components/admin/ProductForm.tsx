"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { IconTrash } from "@tabler/icons-react";
import { GlassTags } from "@/components/shared/GlassTag";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";
import { VariantStockGrid, variantKey, type VariantStockMap } from "@/components/admin/VariantStockGrid";
import { ALL_SIZES, ALL_COLORS } from "@/lib/mock-products";
import {
  useAdminMeta,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type AdminProductInput,
} from "@/services/admin-products";

const productSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  brandId: z.string().min(1, "Marque requise"),
  categoryIds: z.array(z.string()).min(1, "Choisissez au moins une catégorie"),
  gender: z.enum(["HOMME", "FEMME", "ENFANT", "UNISEXE"]),
  usage: z.enum(["RUNNING", "STREETWEAR", "TRAINING", "VILLE", "SPORT"]),
  description: z.string().min(10, "Description trop courte"),
  basePrice: z.coerce.number().positive("Prix requis"),
  compareAtPrice: z.coerce.number().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const GENDER_OPTIONS = [
  { value: "HOMME", label: "Homme" },
  { value: "FEMME", label: "Femme" },
  { value: "ENFANT", label: "Enfant" },
  { value: "UNISEXE", label: "Unisexe" },
];

const USAGE_OPTIONS = [
  { value: "RUNNING", label: "Running" },
  { value: "STREETWEAR", label: "Streetwear" },
  { value: "TRAINING", label: "Training" },
  { value: "VILLE", label: "Ville" },
  { value: "SPORT", label: "Sport" },
];

interface ExistingProduct {
  id: string;
  name: string;
  brandId: string;
  gender: string;
  usage: string | null;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  categories: { categoryId: string }[];
  variants: { size: { eu: number }; color: { name: string }; stock: number }[];
  images: string[];
}

export function ProductForm({ initialProduct }: { initialProduct?: ExistingProduct }) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const { data: meta, isLoading: metaLoading } = useAdminMeta();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(initialProduct?.id ?? "");
  const deleteProduct = useDeleteProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialProduct
      ? {
          name: initialProduct.name,
          brandId: initialProduct.brandId,
          categoryIds: initialProduct.categories.map((c) => c.categoryId),
          gender: initialProduct.gender as ProductFormValues["gender"],
          usage: (initialProduct.usage ?? "STREETWEAR") as ProductFormValues["usage"],
          description: initialProduct.description,
          basePrice: initialProduct.basePrice,
          compareAtPrice: initialProduct.compareAtPrice ?? undefined,
        }
      : { gender: "HOMME", usage: "STREETWEAR" },
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialProduct?.categories.map((c) => c.categoryId) ?? []
  );
  const [images, setImages] = useState<string[]>(initialProduct?.images ?? []);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialProduct ? [...new Set(initialProduct.variants.map((v) => v.color.name))] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialProduct ? [...new Set(initialProduct.variants.map((v) => String(v.size.eu)))] : []
  );
  const [stock, setStock] = useState<VariantStockMap>(() => {
    if (!initialProduct) return {};
    const map: VariantStockMap = {};
    for (const v of initialProduct.variants) {
      map[variantKey(v.size.eu, v.color.name)] = v.stock;
    }
    return map;
  });

  // Garde le champ caché categoryIds du resolver synchronisé avec les tags sélectionnés
  useEffect(() => {
    reset((current) => ({ ...current, categoryIds: selectedCategoryIds } as ProductFormValues));
  }, [selectedCategoryIds, reset]);

  function onSubmit(values: ProductFormValues) {
    if (selectedCategoryIds.length === 0) {
      toast.error("Choisissez au moins une catégorie.");
      return;
    }
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      toast.error("Choisissez au moins une pointure et un coloris.");
      return;
    }
    if (images.length === 0) {
      toast.error("Ajoutez au moins une photo du produit.");
      return;
    }

    const variants = selectedSizes.flatMap((sizeStr) =>
      selectedColors.map((colorName) => ({
        sizeEu: Number(sizeStr),
        colorName,
        stock: stock[variantKey(Number(sizeStr), colorName)] ?? 0,
      }))
    );

    const payload: AdminProductInput = {
      name: values.name,
      brandId: values.brandId,
      categoryIds: selectedCategoryIds,
      gender: values.gender,
      usage: values.usage,
      description: values.description,
      basePrice: values.basePrice,
      compareAtPrice: values.compareAtPrice || null,
      variants,
      images,
    };

    const mutation = isEditing ? updateProduct : createProduct;
    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(isEditing ? "Produit mis à jour." : "Produit créé.");
        router.push("/admin/produits");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
      },
    });
  }

  function handleDelete() {
    if (!initialProduct) return;
    if (!confirm(`Supprimer « ${initialProduct.name} » ? Cette action est irréversible.`)) return;
    deleteProduct.mutate(initialProduct.id, {
      onSuccess: () => {
        toast.success("Produit supprimé.");
        router.push("/admin/produits");
      },
      onError: () => toast.error("Suppression impossible."),
    });
  }

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Informations générales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom du modèle</label>
            <input
              {...register("name")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors.name && <p className="mt-1 text-xs text-yvann-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Marque</label>
            <select
              {...register("brandId")}
              disabled={metaLoading}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            >
              <option value="">Choisir...</option>
              {meta?.brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.brandId && <p className="mt-1 text-xs text-yvann-danger">{errors.brandId.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Genre</label>
            <select
              {...register("gender")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Usage</label>
            <select
              {...register("usage")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            >
              {USAGE_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Catégories</label>
            <GlassTags
              options={(meta?.categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
              selected={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-yvann-danger">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Prix (XOF)</label>
            <input
              type="number"
              {...register("basePrice")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors.basePrice && (
              <p className="mt-1 text-xs text-yvann-danger">{errors.basePrice.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              Ancien prix (optionnel)
            </label>
            <input
              type="number"
              {...register("compareAtPrice")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Photos</h3>
        <ProductImageUploader images={images} onChange={setImages} />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Coloris disponibles</h3>
        <GlassTags
          options={ALL_COLORS.map((c) => ({ value: c.name, label: c.name, swatchColor: c.hex }))}
          selected={selectedColors}
          onChange={setSelectedColors}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Pointures disponibles (EU)</h3>
        <GlassTags
          options={ALL_SIZES.map((s) => ({ value: String(s), label: String(s) }))}
          selected={selectedSizes}
          onChange={setSelectedSizes}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">
          Stock par combinaison pointure × coloris
        </h3>
        <VariantStockGrid
          sizes={selectedSizes.map(Number)}
          colors={selectedColors}
          stock={stock}
          onChange={setStock}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
          >
            {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le produit"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/produits")}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-text dark:border-slate-700"
          >
            Annuler
          </button>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm font-medium text-yvann-danger hover:underline"
          >
            <IconTrash size={15} /> Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
