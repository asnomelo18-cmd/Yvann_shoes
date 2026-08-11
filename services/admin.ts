import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ApiAdminPayment {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: string;
  transactionReference: string | null;
  status: "EN_ATTENTE" | "VALIDE" | "ECHOUE" | "REMBOURSE";
  createdAt: string;
}

export interface ApiAdminOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  paymentMethod: string | null;
  itemCount: number;
  createdAt: string;
}

export function useAdminPayments(status?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin", "payments", status],
    queryFn: async () => {
      const res = await fetch(`/api/admin/payments${status ? `?status=${status}` : ""}`);
      if (!res.ok) throw new Error("Impossible de charger les paiements.");
      const data = await res.json();
      return data.payments as ApiAdminPayment[];
    },
    enabled,
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "VALIDE" | "ECHOUE" }) => {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Impossible de mettre à jour le paiement.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: ["admin", "orders", status],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders${status ? `?status=${status}` : ""}`);
      if (!res.ok) throw new Error("Impossible de charger les commandes.");
      const data = await res.json();
      return data.orders as ApiAdminOrderSummary[];
    },
  });
}

export function useAdminOrderDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) throw new Error("Commande introuvable.");
      const data = await res.json();
      return data.order;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Impossible de mettre à jour la commande.");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "order", variables.id] });
    },
  });
}
