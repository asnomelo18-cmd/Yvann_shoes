"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconWallet, IconBuildingBank, IconCash, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import { paymentSchema, type PaymentFormValues } from "@/lib/checkout-schemas";
import { formatPrice, cn } from "@/lib/utils";
import { useShopSettings } from "@/services/settings";

interface MethodConfig {
  value: PaymentFormValues["method"];
  label: string;
  icon: typeof IconWallet;
  instructions: string;
  payTo: string; // numéro / IBAN — méthode masquée si vide
  requiresReference: boolean;
}

export function PaymentStep({
  defaultValues,
  totalDue,
  onNext,
  onBack,
}: {
  defaultValues: Partial<PaymentFormValues>;
  totalDue: number;
  onNext: (values: PaymentFormValues) => void;
  onBack: () => void;
}) {
  const { data: settings, isLoading: settingsLoading } = useShopSettings();

  const ALL_METHODS: MethodConfig[] = [
    {
      value: "orange_money",
      label: "Orange Money",
      icon: IconWallet,
      instructions: "Envoyez le montant total au numéro ci-dessous, puis indiquez la référence reçue par SMS.",
      payTo: settings?.payment.orangeMoney ?? "",
      requiresReference: true,
    },
    {
      value: "mtn_money",
      label: "MTN Money",
      icon: IconWallet,
      instructions: "Envoyez le montant total au numéro ci-dessous, puis indiquez la référence reçue par SMS.",
      payTo: settings?.payment.mtnMoney ?? "",
      requiresReference: true,
    },
    {
      value: "wave",
      label: "Wave",
      icon: IconWallet,
      instructions: "Envoyez le montant total au numéro ci-dessous, puis indiquez la référence de la transaction.",
      payTo: settings?.payment.wave ?? "",
      requiresReference: true,
    },
    {
      value: "virement",
      label: "Virement bancaire",
      icon: IconBuildingBank,
      instructions: "Effectuez un virement vers les coordonnées ci-dessous, puis indiquez la référence du virement.",
      payTo: settings?.payment.bankAccount ?? "",
      requiresReference: true,
    },
    {
      value: "especes",
      label: "Espèces à la livraison",
      icon: IconCash,
      instructions: "Réglez en espèces directement au livreur à la réception de votre commande.",
      payTo: "",
      requiresReference: false,
    },
  ];

  // Un moyen de paiement n'est proposé que si un vrai numéro a été configuré
  // dans /admin/parametres (ou pour les espèces, qui n'en ont pas besoin).
  const METHODS = ALL_METHODS.filter((m) => m.value === "especes" || m.payTo);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: defaultValues.method ?? "especes", transactionReference: "" },
  });

  const selected = watch("method");

  useEffect(() => {
    if (!settingsLoading && !METHODS.some((m) => m.value === selected)) {
      setValue("method", METHODS[0]?.value ?? "especes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsLoading]);

  const activeMethod = METHODS.find((m) => m.value === selected) ?? METHODS[0];

  function copyPayTo() {
    if (!activeMethod?.payTo) return;
    navigator.clipboard.writeText(activeMethod.payTo);
    toast.success("Copié.");
  }

  if (settingsLoading) {
    return <p className="text-text-muted">Chargement des moyens de paiement...</p>;
  }

  if (!activeMethod) {
    return (
      <p className="max-w-xl text-sm text-text-muted">
        Aucun moyen de paiement n'est configuré pour l'instant. Contactez-nous directement pour
        finaliser votre commande.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="max-w-xl">
      <p className="mb-4 text-sm text-text-muted">
        Le paiement est validé manuellement par notre équipe après réception —
        votre commande passe en préparation dès que le paiement est confirmé.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {METHODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setValue("method", m.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors",
              selected === m.value
                ? "border-yvann-gold-600 bg-yvann-gold-500/5"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <m.icon size={22} className="text-yvann-gold-text" />
            <span className="text-xs font-medium text-text">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <p className="text-sm text-text">{activeMethod.instructions}</p>

        {activeMethod.payTo && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-text-muted">Montant à envoyer</p>
              <p className="break-words text-sm font-semibold text-text">{formatPrice(totalDue)}</p>
              <p className="mt-1 text-xs text-text-muted">Destinataire</p>
              <p className="break-words text-sm font-medium text-text">{activeMethod.payTo}</p>
            </div>
            <button
              type="button"
              aria-label="Copier le numéro"
              onClick={copyPayTo}
              className="shrink-0 rounded-full border border-slate-300 p-2 text-text dark:border-slate-700"
            >
              <IconCopy size={16} />
            </button>
          </div>
        )}

        {activeMethod.requiresReference && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-text-muted">
              Référence de la transaction
            </label>
            <input
              {...register("transactionReference")}
              placeholder="Ex. TXN123456789"
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
            />
            {errors.transactionReference && (
              <p className="mt-1 text-xs text-yvann-danger">
                {errors.transactionReference.message}
              </p>
            )}
          </div>
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
          className="rounded-full bg-yvann-gold-600 px-8 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          Valider ma commande
        </button>
      </div>
    </form>
  );
}
