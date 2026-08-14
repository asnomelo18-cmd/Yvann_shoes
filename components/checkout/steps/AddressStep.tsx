"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconMapPin, IconPlus, IconStar } from "@tabler/icons-react";
import { addressSchema, type AddressFormValues } from "@/lib/checkout-schemas";
import { useAddresses, useCreateAddress, type Address } from "@/services/addresses";
import { cn } from "@/lib/utils";

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

function toAddressFormValues(address: Address): AddressFormValues {
  return {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 ?? undefined,
    city: address.city,
    region: address.region ?? undefined,
    postalCode: address.postalCode ?? undefined,
    country: address.country,
  };
}

export function AddressStep({
  defaultValues,
  onNext,
}: {
  defaultValues: Partial<AddressFormValues>;
  onNext: (values: AddressFormValues) => void;
}) {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();

  const [mode, setMode] = useState<"select" | "form">("form");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveForLater, setSaveForLater] = useState(false);

  const hasAddresses = (addresses?.length ?? 0) > 0;

  // Dès que les adresses arrivent, propose la sélection avec l'adresse par
  // défaut pré-cochée plutôt que d'ouvrir directement le formulaire vierge.
  useEffect(() => {
    if (hasAddresses && selectedId === null) {
      const def = addresses!.find((a) => a.isDefault) ?? addresses![0];
      if (def) {
        setSelectedId(def.id);
        setMode("select");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAddresses]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  function handleManualSubmit(values: AddressFormValues) {
    if (saveForLater) {
      createAddress.mutate(
        {
          fullName: values.fullName,
          phone: values.phone,
          line1: values.line1,
          line2: values.line2 || null,
          city: values.city,
          region: values.region || null,
          postalCode: values.postalCode || null,
          country: values.country,
          label: null,
          isDefault: !hasAddresses,
        },
        { onError: () => toast.error("L'adresse n'a pas pu être enregistrée pour la prochaine fois.") }
      );
    }
    onNext(values);
  }

  function handleSelectSubmit() {
    const selected = addresses?.find((a) => a.id === selectedId);
    if (!selected) {
      toast.error("Choisissez une adresse.");
      return;
    }
    onNext(toAddressFormValues(selected));
  }

  if (isLoading) {
    return <p className="text-text-muted">Chargement de vos adresses...</p>;
  }

  if (mode === "select") {
    return (
      <div className="max-w-xl">
        <div className="space-y-3">
          {addresses!.map((address) => (
            <label
              key={address.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                selectedId === address.id
                  ? "border-yvann-gold-600 bg-yvann-gold-500/5"
                  : "border-slate-200 dark:border-slate-800"
              )}
            >
              <input
                type="radio"
                className="sr-only"
                checked={selectedId === address.id}
                onChange={() => setSelectedId(address.id)}
              />
              <IconMapPin size={20} className="mt-0.5 shrink-0 text-yvann-gold-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {address.label && (
                    <span className="text-xs font-medium text-yvann-gold-700">{address.label}</span>
                  )}
                  {address.isDefault && (
                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <IconStar size={11} /> Par défaut
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-text">{address.fullName}</p>
                <p className="text-sm text-text-muted">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city} — {address.country}
                </p>
                <p className="text-sm text-text-muted">{address.phone}</p>
              </div>
            </label>
          ))}

          <button
            type="button"
            onClick={() => setMode("form")}
            className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-medium text-text-muted hover:border-yvann-gold-500 hover:text-yvann-gold-700 dark:border-slate-700"
          >
            <IconPlus size={16} /> Utiliser une nouvelle adresse
          </button>
        </div>

        <button
          onClick={handleSelectSubmit}
          className="mt-8 rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          Continuer vers la livraison
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleManualSubmit)} className="max-w-xl">
      {hasAddresses && (
        <button
          type="button"
          onClick={() => setMode("select")}
          className="mb-4 text-sm font-medium text-yvann-gold-700 hover:underline"
        >
          ← Choisir parmi mes adresses enregistrées
        </button>
      )}

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

      <label className="mt-4 flex items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={saveForLater}
          onChange={(e) => setSaveForLater(e.target.checked)}
          className="h-4 w-4 accent-yvann-gold-600"
        />
        Enregistrer cette adresse pour mes prochaines commandes
      </label>

      <button
        type="submit"
        className="mt-8 rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
      >
        Continuer vers la livraison
      </button>
    </form>
  );
}
