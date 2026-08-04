"use client";

import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import {
  IconClockHour4,
  IconCircleCheck,
  IconCircleX,
  IconWallet,
  IconCopy,
} from "@tabler/icons-react";
import { StatCard, StatCardSkeleton } from "@/components/cards/StatCard";
import { useAdminPayments, useUpdatePaymentStatus, type ApiAdminPayment } from "@/services/admin";
import { formatPrice, cn } from "@/lib/utils";

const METHOD_LABELS: Record<string, string> = {
  ORANGE_MONEY: "Orange Money",
  MTN_MONEY: "MTN Money",
  WAVE: "Wave",
  VIREMENT: "Virement",
  ESPECES: "Espèces",
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  EN_ATTENTE: { label: "En attente", className: "bg-yvann-warning/15 text-yvann-warning" },
  VALIDE: { label: "Validé", className: "bg-yvann-success/15 text-yvann-success" },
  ECHOUE: { label: "Échoué", className: "bg-yvann-danger/15 text-yvann-danger" },
  REMBOURSE: { label: "Remboursé", className: "bg-yvann-charcoal-500/15 text-text-muted" },
};

const TABS: { value: string; label: string }[] = [
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "VALIDE", label: "Validés" },
  { value: "ECHOUE", label: "Échoués" },
  { value: "TOUS", label: "Tous" },
];

export default function AdminPaiementsPage() {
  const [tab, setTab] = useState("EN_ATTENTE");
  const [pendingAction, setPendingAction] = useState<{ id: string; action: "VALIDE" | "ECHOUE" } | null>(null);

  const { data: filtered, isLoading } = useAdminPayments(tab === "TOUS" ? undefined : tab);
  const { data: allPending } = useAdminPayments("EN_ATTENTE");
  const { data: allValid } = useAdminPayments("VALIDE");
  const { data: allFailed } = useAdminPayments("ECHOUE");
  const updateStatus = useUpdatePaymentStatus();

  const pending = allPending ?? [];
  const pendingTotal = pending.reduce((sum, p) => sum + p.amount, 0);

  function applyAction() {
    if (!pendingAction) return;
    updateStatus.mutate(
      { id: pendingAction.id, status: pendingAction.action },
      {
      onSuccess: () => {
        toast.success(
          pendingAction.action === "VALIDE" ? "Paiement validé." : "Paiement marqué comme échoué."
        );
        setPendingAction(null);
      },
      onError: () => {
        toast.error("Impossible de mettre à jour ce paiement.");
        setPendingAction(null);
      },
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {!allPending || !allValid || !allFailed ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Paiements en attente" value={String(pending.length)} icon={IconClockHour4} tone="warning" />
            <StatCard label="Montant en attente" value={formatPrice(pendingTotal)} icon={IconWallet} tone="warning" />
            <StatCard label="Validés (total)" value={String(allValid.length)} icon={IconCircleCheck} tone="success" />
            <StatCard label="Échoués (total)" value={String(allFailed.length)} icon={IconCircleX} tone="danger" />
          </>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.value ? "bg-yvann-gold-600 text-white" : "border border-slate-300 text-text-muted dark:border-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Moyen</th>
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : !filtered || filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                  Aucun paiement dans cette catégorie.
                </td>
              </tr>
            ) : (
              filtered.map((p: ApiAdminPayment) => (
                <tr key={p.id} className="text-text">
                  <td className="px-4 py-3 font-medium">{p.orderNumber}</td>
                  <td className="px-4 py-3">{p.customerName}</td>
                  <td className="px-4 py-3">{METHOD_LABELS[p.method] ?? p.method}</td>
                  <td className="px-4 py-3">
                    {p.transactionReference ? (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.transactionReference!);
                          toast.success("Référence copiée.");
                        }}
                        className="flex items-center gap-1 text-text-muted hover:text-text"
                      >
                        {p.transactionReference} <IconCopy size={13} />
                      </button>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_CONFIG[p.status]?.className)}>
                      {STATUS_CONFIG[p.status]?.label ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "EN_ATTENTE" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setPendingAction({ id: p.id, action: "VALIDE" })}
                          className="rounded-full bg-yvann-success/15 px-3 py-1.5 text-xs font-medium text-yvann-success hover:bg-yvann-success/25"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => setPendingAction({ id: p.id, action: "ECHOUE" })}
                          className="rounded-full bg-yvann-danger/15 px-3 py-1.5 text-xs font-medium text-yvann-danger hover:bg-yvann-danger/25"
                        >
                          Rejeter
                        </button>
                      </div>
                    ) : (
                      <span className="block text-right text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog.Root open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[90] bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[91] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6">
            <AlertDialog.Title className="text-base font-semibold text-text">
              {pendingAction?.action === "VALIDE" ? "Confirmer la validation du paiement ?" : "Marquer ce paiement comme échoué ?"}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-text-muted">
              {pendingAction?.action === "VALIDE"
                ? "La commande passera au statut « Payée ». Assurez-vous d'avoir vérifié la réception des fonds."
                : "Le client sera notifié que son paiement n'a pas pu être confirmé."}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-text dark:border-slate-700">
                  Annuler
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={applyAction}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold text-white",
                    pendingAction?.action === "VALIDE" ? "bg-yvann-success" : "bg-yvann-danger"
                  )}
                >
                  Confirmer
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
