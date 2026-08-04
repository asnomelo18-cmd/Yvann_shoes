import { useMutation } from "@tanstack/react-query";
import type { AddressFormValues, DeliveryFormValues, PaymentFormValues } from "@/lib/checkout-schemas";

export interface CreateOrderPayload {
  items: { variantId: string; quantity: number }[];
  address: AddressFormValues;
  deliveryMethod: DeliveryFormValues["method"];
  payment: {
    method: Uppercase<PaymentFormValues["method"]>;
    transactionReference?: string;
  };
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : "Impossible de créer la commande."
        );
      }
      return res.json() as Promise<{ order: { id: string; orderNumber: string } }>;
    },
  });
}
