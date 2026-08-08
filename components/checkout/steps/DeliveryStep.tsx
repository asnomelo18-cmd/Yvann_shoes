"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconTruckDelivery } from "@tabler/icons-react";
import { deliverySchema, type DeliveryFormValues } from "@/lib/checkout-schemas";
import { formatPrice, cn } from "@/lib/utils";
import { useShopSettings } from "@/services/settings";

export function DeliveryStep({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: Partial<DeliveryFormValues>;
  onNext: (values: DeliveryFormValues) => void;
  onBack: () => void;
}) {
  const { data: settings, isLoading } = useShopSettings();
  const zones = settings?.shippingZones ?? [];

  const { handleSubmit, watch, setValue } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { zoneName: defaultValues.zoneName ?? "" },
  });

  const selected = watch("zoneName");

  if (isLoading) {
    return <p className="text-text-muted">Chargement des zones de livraison...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="max-w-xl">
      <div className="space-y-3">
        {zones.map((zone) => (
          <label
            key={zone.name}
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors",
              selected === zone.name
                ? "border-yvann-gold-600 bg-yvann-gold-500/5"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={selected === zone.name}
              onChange={() => setValue("zoneName", zone.name)}
            />
            <IconTruckDelivery size={22} className="text-yvann-gold-700" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text">{zone.name}</p>
            </div>
            <span className="text-sm font-semibold text-text">{formatPrice(zone.price)}</span>
          </label>
        ))}
        {zones.length === 0 && (
          <p className="text-sm text-text-muted">
            Aucune zone de livraison configurée pour l'instant.
          </p>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-text dark:border-slate-700"
        >
          Retour
        </button>
        <button
          type="submit"
          disabled={!selected}
          className="rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
        >
          Continuer vers le paiement
        </button>
      </div>
    </form>
  );
}
