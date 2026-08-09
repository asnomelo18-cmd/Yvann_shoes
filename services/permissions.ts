import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PermissionMatrix, SectionKey } from "@/lib/permissions";

export function useMyPermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/permissions");
      if (!res.ok) return null;
      return res.json() as Promise<{ permissions: PermissionMatrix; role: string }>;
    },
  });
}

export function canAccessSection(
  role: string | undefined,
  section: SectionKey,
  permissions: PermissionMatrix | undefined
): boolean {
  if (!role) return false;
  if (role === "ADMIN") return true;
  if (role === "CLIENT") return false;
  return !!permissions?.[role as "MANAGER" | "SUPPORT" | "VENDEUR"]?.includes(section);
}

export function useSavePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (matrix: PermissionMatrix) => {
      const res = await fetch("/api/admin/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matrix),
      });
      if (!res.ok) throw new Error("Enregistrement impossible.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissions"] }),
  });
}
