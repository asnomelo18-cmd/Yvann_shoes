"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconShoppingBag } from "@tabler/icons-react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCartStore } from "@/store/cart-store";

export default function PanierPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">Votre panier</h1>

      {lines.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <IconShoppingBag size={40} className="text-text-muted" />
          <p className="text-text-muted">Votre panier est vide pour le moment.</p>
          <Link
            href="/boutique"
            className="rounded-full bg-rho-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rho-blue-700"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 lg:col-span-2">
            {lines.map((line) => (
              <CartLineItem key={line.variantId} line={line} />
            ))}
          </div>
          <div>
            <OrderSummary
              subtotal={subtotal}
              ctaLabel="Passer au paiement"
              onCta={() => router.push("/checkout")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
