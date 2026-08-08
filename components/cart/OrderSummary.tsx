"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const SHIPPING_ESTIMATE = 2500;
const TAX_RATE = 0.0; // TVA non applicable par défaut — à ajuster selon la zone (Setting/Tax en base)

export function OrderSummary({
  subtotal,
  ctaLabel,
  onCta,
}: {
  subtotal: number;
  ctaLabel: string;
  onCta: () => void;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  function applyCoupon() {
    if (!couponCode) return;
    // TODO : valider le coupon via services/coupons.ts (table Coupon)
    toast.error("Code promo invalide ou expiré.");
  }

  const shipping = subtotal > 0 ? SHIPPING_ESTIMATE : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
      <h2 className="text-sm font-semibold text-text">Récapitulatif</h2>

      <div className="mt-4 flex gap-2">
        <input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Code promo"
          className="flex-1 rounded-full border border-slate-300 bg-transparent px-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none dark:border-slate-700"
        />
        <button
          onClick={applyCoupon}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-text dark:border-slate-700"
        >
          Appliquer
        </button>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex flex-wrap justify-between gap-x-2 text-text-muted">
          <dt>Sous-total</dt>
          <dd className="break-words">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-2 text-text-muted">
          <dt>Livraison estimée</dt>
          <dd className="break-words">{formatPrice(shipping)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-2 text-text-muted">
          <dt>Taxes</dt>
          <dd className="break-words">{formatPrice(tax)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex flex-wrap justify-between gap-x-2 text-yvann-successText">
            <dt>Réduction</dt>
            <dd className="break-words">-{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-x-2 border-t border-slate-200 pt-2 text-base font-semibold text-text dark:border-slate-800">
          <dt>Total</dt>
          <dd className="break-words">{formatPrice(total)}</dd>
        </div>
      </dl>

      <button
        onClick={onCta}
        disabled={subtotal === 0}
        className="mt-5 w-full rounded-full bg-yvann-gold-600 py-3 text-sm font-semibold text-yvann-black-950 transition-colors hover:bg-yvann-gold-500 disabled:opacity-40"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
