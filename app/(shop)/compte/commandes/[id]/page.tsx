"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconCheck, IconFileInvoice, IconTruckDelivery } from "@tabler/icons-react";
import { useMyOrderDetail } from "@/services/orders";
import { formatPrice, cn } from "@/lib/utils";

const TIMELINE_STEPS = [
  { key: "EN_ATTENTE", label: "Commande reçue" },
  { key: "PAYEE", label: "Paiement confirmé" },
  { key: "PREPARATION", label: "En préparation" },
  { key: "EXPEDIEE", label: "Expédiée" },
  { key: "LIVREE", label: "Livrée" },
];

export default function SuiviCommandePage() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useMyOrderDetail(params.id);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-text-muted">Chargement...</div>;
  }
  if (isError || !order) return notFound();

  const isCancelled = ["ANNULEE", "REMBOURSEE"].includes(order.status);
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <Link href="/compte" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} /> Retour au compte
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-text-muted">
            Commandée le{" "}
            {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <a
          href={`/api/orders/${order.id}/invoice`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-text hover:border-yvann-gold-500 dark:border-slate-700"
        >
          <IconFileInvoice size={16} /> Télécharger la facture
        </a>
      </div>

      {isCancelled ? (
        <div className="mt-8 rounded-2xl border border-yvann-danger/30 bg-yvann-danger/5 p-5 text-sm text-text">
          Cette commande est {order.status === "ANNULEE" ? "annulée" : "remboursée"}.
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex items-center">
            {TIMELINE_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              return (
                <div key={step.key} className="flex flex-1 flex-col items-center last:flex-none">
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                        done
                          ? "border-yvann-gold-600 bg-yvann-gold-600 text-yvann-black-950"
                          : "border-slate-300 text-text-muted dark:border-slate-700"
                      )}
                    >
                      {done ? <IconCheck size={16} /> : i + 1}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className="mx-1 h-0.5 flex-1 bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-0.5 bg-yvann-gold-600 transition-all"
                          style={{ width: i < currentStepIndex ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 max-w-[80px] text-center text-[11px] font-medium",
                      done ? "text-text" : "text-text-muted"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {order.shipment?.trackingNumber && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 p-4 text-sm text-text-muted dark:border-slate-800">
              <IconTruckDelivery size={18} className="text-yvann-gold-600" />
              Numéro de suivi : <span className="font-medium text-text">{order.shipment.trackingNumber}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-text">Articles</h2>
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-text">{item.product.name}</p>
                <p className="text-xs text-text-muted">
                  Pointure {item.variant.size.eu} · {item.variant.color.name} · Qté {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-text">
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-text">Livraison</h3>
          <p className="mt-2 text-sm text-text-muted">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-text">Paiement</h3>
          <p className="mt-2 text-sm text-text-muted">{order.payment?.method ?? "—"}</p>
          {order.payment?.transactionReference && (
            <p className="text-xs text-text-muted">Réf. {order.payment.transactionReference}</p>
          )}
        </div>
      </div>
    </div>
  );
}
