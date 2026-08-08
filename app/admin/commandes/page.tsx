"use client";

import { useState } from "react";
import Link from "next/link";
import { IconEye } from "@tabler/icons-react";
import { useAdminOrders } from "@/services/admin";
import { formatPrice, cn } from "@/lib/utils";

const ORDER_STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  PREPARATION: "Préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

const STATUS_TONE: Record<string, string> = {
  EN_ATTENTE: "bg-yvann-warning/15 text-yvann-warningText",
  PAYEE: "bg-yvann-gold-500/15 text-yvann-gold-700",
  PREPARATION: "bg-yvann-bronze-500/15 text-yvann-bronzeText",
  EXPEDIEE: "bg-yvann-gold-500/15 text-yvann-gold-700",
  LIVREE: "bg-yvann-success/15 text-yvann-successText",
  ANNULEE: "bg-yvann-danger/15 text-yvann-danger",
  REMBOURSEE: "bg-slate-400/15 text-text-muted",
};

const TABS = [
  { value: "TOUS", label: "Toutes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "PAYEE", label: "Payées" },
  { value: "PREPARATION", label: "Préparation" },
  { value: "EXPEDIEE", label: "Expédiées" },
  { value: "LIVREE", label: "Livrées" },
];

export default function AdminCommandesPage() {
  const [tab, setTab] = useState("TOUS");
  const { data: orders, isLoading } = useAdminOrders(tab === "TOUS" ? undefined : tab);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
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
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paiement</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : !orders || orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                  Aucune commande dans cette catégorie.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="text-text">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-text-muted">{order.itemCount} paire(s)</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-text-muted">{order.paymentMethod ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_TONE[order.status])}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-text hover:border-yvann-gold-500 dark:border-slate-700"
                    >
                      <IconEye size={14} /> Voir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
