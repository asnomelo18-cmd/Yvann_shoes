import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Address {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, "id">;

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.addresses as Address[];
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddressInput) => {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Création impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: AddressInput & { id: string }) => {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Suppression impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
