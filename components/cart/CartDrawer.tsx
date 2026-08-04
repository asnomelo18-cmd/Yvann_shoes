"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconX, IconShoppingBag } from "@tabler/icons-react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCartStore } from "@/store/cart-store";

export function CartDrawer() {
  const router = useRouter();
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="text-base font-semibold text-text">
                Votre panier ({lines.reduce((n, l) => n + l.quantity, 0)})
              </h2>
              <button aria-label="Fermer le panier" onClick={close}>
                <IconX size={20} className="text-text" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-text-muted">
                  <IconShoppingBag size={32} />
                  <p className="text-sm">Votre panier est vide.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {lines.map((line) => (
                    <CartLineItem key={line.variantId} line={line} />
                  ))}
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-slate-200 p-5 dark:border-slate-800">
                <OrderSummary
                  subtotal={subtotal}
                  ctaLabel="Commander"
                  onCta={() => {
                    close();
                    router.push("/checkout");
                  }}
                />
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
