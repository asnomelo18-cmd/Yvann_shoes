"use client";

import { useParams, notFound } from "next/navigation";
import { toast } from "sonner";
import { IconFileInvoice, IconTruckDelivery, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useAdminOrderDetail, useUpdateOrderStatus } from "@/services/admin";
import { formatPrice, cn } from "@/lib/utils";

const ORDER_STATUS_FLOW = ["EN_ATTENTE", "PAYEE", "PREPARATION", "EXPEDIEE", "LIVREE"];
const ORDER_STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  PREPARATION: "Préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrderDetail(params.id);
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return <div className="text-text-muted">Chargement...</div>;
  }
  if (!order) return notFound();

  const currentStepIndex = ORDER_STATUS_FLOW.indexOf(order.status);

  function updateOrderStatus(newStatus: string) {
    updateStatus.mutate(
      { id: params.id, status: newStatus },
      {
        onSuccess: () => toast.success(`Commande passée au statut « ${ORDER_STATUS_LABELS[newStatus]} ».`),
        onError: () => toast.error("Impossible de mettre à jour le statut."),
      }
    );
  }

  return (
    <div className="max-w-4xl">
      <Link href="/admin/commandes" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} /> Retour aux commandes
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-text">{order.orderNumber}</h2>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm text-text dark:border-slate-700">
            <IconFileInvoice size={16} /> Facture PDF
          </button>
          <button
            onClick={() => updateOrderStatus("EXPEDIEE")}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm text-text dark:border-slate-700"
          >
            <IconTruckDelivery size={16} /> Marquer expédiée
          </button>
        </div>
      </div>

      {!["ANNULEE", "REMBOURSEE"].includes(order.status) && (
        <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1">
            {ORDER_STATUS_FLOW.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <button
                  onClick={() => updateOrderStatus(s)}
                  className={cn(
                    "flex h-8 min-w-[92px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-2 text-xs font-medium transition-colors",
                    i <= currentStepIndex ? "bg-yvann-gold-600 text-yvann-black-950" : "border border-slate-300 text-text-muted dark:border-slate-700"
                  )}
                >
                  {ORDER_STATUS_LABELS[s]}
                </button>
                {i < ORDER_STATUS_FLOW.length - 1 && <div className="w-2 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-text">Articles</h3>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">{item.product.name}</p>
                  <p className="truncate text-xs text-text-muted">
                    Pointure {item.variant.size.eu} · {item.variant.color.name} · Qté {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 break-words text-sm font-semibold text-text">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-text-muted">Total</p>
              <p className="text-lg font-semibold text-text">{formatPrice(Number(order.total))}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-text">Client</h3>
            <p className="mt-2 text-sm text-text">
              {order.user.firstName} {order.user.lastName}
            </p>
            <p className="text-xs text-text-muted">{order.user.email}</p>
            <p className="text-xs text-text-muted">{order.user.phone}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-text">Livraison</h3>
            <p className="mt-2 text-sm text-text-muted">
              {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-text">Paiement</h3>
            <p className="mt-2 text-sm text-text-muted">{order.payment?.method ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
