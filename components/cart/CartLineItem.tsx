"use client";

import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartLine } from "@/store/cart-store";

export function CartLineItem({ line }: { line: CartLine }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  return (
    <div className="flex gap-3 py-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
        <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-text">{line.name}</p>
          <p className="text-xs text-text-muted">
            Pointure {line.size} · {line.color}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-slate-300 px-2 py-0.5 dark:border-slate-700">
            <button
              aria-label="Diminuer la quantité"
              onClick={() => setQuantity(line.variantId, Math.max(1, line.quantity - 1))}
              className="p-1 text-text"
            >
              <IconMinus size={12} />
            </button>
            <span className="w-3 text-center text-xs text-text">{line.quantity}</span>
            <button
              aria-label="Augmenter la quantité"
              onClick={() => setQuantity(line.variantId, line.quantity + 1)}
              className="p-1 text-text"
            >
              <IconPlus size={12} />
            </button>
          </div>
          <span className="text-sm font-semibold text-text">
            {formatPrice(line.unitPrice * line.quantity)}
          </span>
        </div>
      </div>

      <button
        aria-label="Retirer du panier"
        onClick={() => removeLine(line.variantId)}
        className="self-start text-text-muted hover:text-rho-danger"
      >
        <IconTrash size={16} />
      </button>
    </div>
  );
}
