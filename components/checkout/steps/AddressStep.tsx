"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "@/lib/checkout-schemas";

const FIELDS: { name: keyof AddressFormValues; label: string; span?: "full" }[] = [
  { name: "fullName", label: "Nom complet", span: "full" },
  { name: "phone", label: "Téléphone" },
  { name: "country", label: "Pays" },
  { name: "line1", label: "Adresse", span: "full" },
  { name: "line2", label: "Complément d'adresse (optionnel)", span: "full" },
  { name: "city", label: "Ville" },
  { name: "region", label: "Région (optionnel)" },
  { name: "postalCode", label: "Code postal (optionnel)" },
];

export function AddressStep({
  defaultValues,
  onNext,
}: {
  defaultValues: Partial<AddressFormValues>;
  onNext: (values: AddressFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.span === "full" ? "col-span-2" : undefined}>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              {field.label}
            </label>
            <input
              {...register(field.name)}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors[field.name] && (
              <p className="mt-1 text-xs text-yvann-danger">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-8 rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
      >
        Continuer vers la livraison
      </button>
    </form>
  );
}
