"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { IconTrash } from "@tabler/icons-react";
import { GlassTags } from "@/components/shared/GlassTag";
import { VariantStockGrid, variantKey, type VariantStockMap } from "@/components/admin/VariantStockGrid";
import { BRANDS, ALL_SIZES, ALL_COLORS, type MockProduct } from "@/lib/mock-products";

const productSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  brand: z.string().min(1, "Marque requise"),
  category: z.enum(["sneakers", "running", "ville", "training"]),
  gender: z.enum(["homme", "femme", "enfant"]),
  usage: z.enum(["running", "streetwear", "training", "ville", "sport"]),
  description: z.string().min(10, "Description trop courte"),
  basePrice: z.coerce.number().positive("Prix requis"),
  compareAtPrice: z.coerce.number().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CATEGORY_OPTIONS = [
  { value: "sneakers", label: "Sneakers" },
  { value: "running", label: "Running" },
  { value: "ville", label: "Ville" },
  { value: "training", label: "Training" },
];

const GENDER_OPTIONS = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "enfant", label: "Enfant" },
];

const USAGE_OPTIONS = [
  { value: "running", label: "Running" },
  { value: "streetwear", label: "Streetwear" },
  { value: "training", label: "Training" },
  { value: "ville", label: "Ville" },
  { value: "sport", label: "Sport" },
];

export function ProductForm({ initialProduct }: { initialProduct?: MockProduct }) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialProduct
      ? {
          name: initialProduct.name,
          brand: initialProduct.brand,
          category: initialProduct.category,
          gender: initialProduct.gender,
          usage: initialProduct.usage,
          description: "",
          basePrice: initialProduct.basePrice,
          compareAtPrice: initialProduct.compareAtPrice ?? undefined,
        }
      : { category: "sneakers", gender: "homme", usage: "streetwear" },
  });

  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialProduct?.colors.map((c) => c.name) ?? []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialProduct?.availableSizes.map(String) ?? []
  );
  const [stock, setStock] = useState<VariantStockMap>(() => {
    if (!initialProduct) return {};
    const map: VariantStockMap = {};
    for (const size of initialProduct.availableSizes) {
      for (const color of initialProduct.colors) {
        map[variantKey(size, color.name)] = 8; // stock de démo — non fourni par MockProduct
      }
    }
    return map;
  });

  function onSubmit(values: ProductFormValues) {
    // TODO : POST/PATCH /api/admin/products → Prisma (Product + Variant en une transaction)
    // Chaque combinaison de `stock` devient une ligne Variant { productId, sizeId, colorId, stock }
    console.log({ values, colors: selectedColors, sizes: selectedSizes, stock });
    toast.success(isEditing ? "Produit mis à jour." : "Produit créé.");
    router.push("/admin/produits");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <section>
        <h3 className="mb-4 text-sm font-semibold text-text">Informations générales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Nom du modèle</label>
            <input
              {...register("name")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            />
            {errors.name && <p className="mt-1 text-xs text-rho-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Marque</label>
            <select
              {...register("brand")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            >
              <option value="">Choisir...</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.brand && <p className="mt-1 text-xs text-rho-danger">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Catégorie</label>
            <select
              {...register("category")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Genre</label>
            <select
              {...register("gender")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
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
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            >
              {USAGE_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rho-danger">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Prix (XOF)</label>
            <input
              type="number"
              {...register("basePrice")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            />
            {errors.basePrice && (
              <p className="mt-1 text-xs text-rho-danger">{errors.basePrice.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              Ancien prix (optionnel)
            </label>
            <input
              type="number"
              {...register("compareAtPrice")}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-rho-blue-500 focus:outline-none dark:border-slate-700"
            />
          </div>
        </div>
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

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-rho-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-rho-blue-700"
          >
            {isEditing ? "Enregistrer les modifications" : "Créer le produit"}
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
            onClick={() => {
              toast.success("Produit supprimé.");
              router.push("/admin/produits");
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-rho-danger hover:underline"
          >
            <IconTrash size={15} /> Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
