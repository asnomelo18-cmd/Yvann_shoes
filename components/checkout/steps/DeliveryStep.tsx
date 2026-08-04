"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconTruckDelivery, IconBolt } from "@tabler/icons-react";
import { deliverySchema, type DeliveryFormValues } from "@/lib/checkout-schemas";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    value: "standard" as const,
    icon: IconTruckDelivery,
    label: "Livraison standard",
    detail: "2 à 5 jours ouvrés",
    price: 2500,
  },
  {
    value: "express" as const,
    icon: IconBolt,
    label: "Livraison express",
    detail: "24 à 48h",
    price: 6000,
  },
];

export function DeliveryStep({
  defaultValues,
  onNext,
  onBack,
}: {
  defaultValues: Partial<DeliveryFormValues>;
  onNext: (values: DeliveryFormValues) => void;
  onBack: () => void;
}) {
  const { handleSubmit, watch, setValue } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { method: defaultValues.method ?? "standard" },
  });

  const selected = watch("method");

  return (
    <form onSubmit={handleSubmit(onNext)} className="max-w-xl">
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors",
              selected === opt.value
                ? "border-yvann-gold-600 bg-yvann-gold-500/5"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={selected === opt.value}
              onChange={() => setValue("method", opt.value)}
            />
            <opt.icon size={22} className="text-yvann-gold-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text">{opt.label}</p>
              <p className="text-xs text-text-muted">{opt.detail}</p>
            </div>
            <span className="text-sm font-semibold text-text">{formatPrice(opt.price)}</span>
          </label>
        ))}
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
          className="rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-white hover:bg-yvann-gold-700"
        >
          Continuer vers le paiement
        </button>
      </div>
    </form>
  );
}
