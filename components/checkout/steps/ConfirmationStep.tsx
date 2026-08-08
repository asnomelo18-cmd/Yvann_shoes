"use client";

import Link from "next/link";
import { IconClockHour4 } from "@tabler/icons-react";
import { formatPrice } from "@/lib/utils";
import type { AddressFormValues, DeliveryFormValues, PaymentFormValues } from "@/lib/checkout-schemas";
import type { CartLine } from "@/store/cart-store";

const PAYMENT_LABELS: Record<PaymentFormValues["method"], string> = {
  orange_money: "Orange Money",
  mtn_money: "MTN Money",
  wave: "Wave",
  virement: "Virement bancaire",
  especes: "Espèces à la livraison",
};

export function ConfirmationStep({
  orderNumber,
  address,
  delivery,
  payment,
  lines,
  total,
}: {
  orderNumber: string;
  address: AddressFormValues;
  delivery: DeliveryFormValues;
  payment: PaymentFormValues;
  lines: CartLine[];
  total: number;
}) {
  return (
    <div className="max-w-xl text-center">
      <IconClockHour4 size={48} className="mx-auto text-yvann-warning" />
      <h2 className="mt-4 text-2xl font-semibold text-text">Commande enregistrée</h2>
      <p className="mt-2 text-sm text-text-muted">
        Commande <span className="font-medium text-text">#{orderNumber}</span> — en
        attente de validation du paiement par notre équipe. Vous recevrez un
        e-mail dès que c'est confirmé, puis votre commande partira en préparation.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 p-5 text-left dark:border-slate-800">
        <div className="space-y-1 text-sm">
          <p className="text-text">
            <span className="text-text-muted">Livraison à :</span> {address.fullName}, {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.country}
          </p>
          <p className="text-text">
            <span className="text-text-muted">Livraison :</span> {delivery.zoneName}
          </p>
          <p className="text-text">
            <span className="text-text-muted">Paiement :</span> {PAYMENT_LABELS[payment.method]}
          </p>
        </div>

        <div className="mt-4 divide-y divide-slate-100 border-t border-slate-200 pt-2 dark:divide-slate-800 dark:border-slate-800">
          {lines.map((line) => (
            <div key={line.variantId} className="flex justify-between py-2 text-sm">
              <span className="text-text-muted">
                {line.name} × {line.quantity} ({line.size}, {line.color})
              </span>
              <span className="text-text">{formatPrice(line.unitPrice * line.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-text dark:border-slate-800">
          <span>Total dû</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/compte/commandes"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-text dark:border-slate-700"
        >
          Suivre ma commande
        </Link>
        <Link
          href="/boutique"
          className="rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-white hover:bg-yvann-gold-700"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
