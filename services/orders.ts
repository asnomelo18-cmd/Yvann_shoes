import { useMutation, useQuery } from "@tanstack/react-query";
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

export interface MyOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentStatus: string | null;
  itemCount: number;
  createdAt: string;
}

export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders/mine");
      if (!res.ok) throw new Error("Impossible de charger vos commandes.");
      const data = await res.json();
      return data.orders as MyOrder[];
    },
  });
}
