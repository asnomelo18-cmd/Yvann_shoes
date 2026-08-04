import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  variantId: string;
  name: string;
  imageUrl: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  isOpen: boolean;
  lines: CartLine[];
  open: () => void;
  close: () => void;
  addLine: (line: CartLine) => void;
  removeLine: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      lines: [],
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === line.variantId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeLine: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    }),
    { name: "rho-cart" }
  )
);

// Autres slices à créer sur le même modèle : wishlist-store.ts, compare-store.ts, ui-store.ts (dark mode, langue, devise)
