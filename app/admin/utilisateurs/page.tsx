"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

const ROLE_OPTIONS = ["CLIENT", "VENDEUR", "SUPPORT", "MANAGER", "ADMIN"];
const ROLE_TONE: Record<string, string> = {
  ADMIN: "bg-yvann-danger/15 text-yvann-danger",
  MANAGER: "bg-yvann-gold-500/15 text-yvann-gold-600",
  SUPPORT: "bg-yvann-bronze-500/15 text-yvann-bronze-500",
  VENDEUR: "bg-yvann-success/15 text-yvann-success",
  CLIENT: "bg-slate-400/15 text-text-muted",
};

export default function AdminUtilisateursPage() {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.users as AdminUser[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Mise à jour impossible.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Rôle mis à jour.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur."),
  });

  const filtered = (users ?? []).filter(
    (u) =>
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 dark:border-slate-700 sm:w-72">
        <IconSearch size={15} className="text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom ou e-mail..."
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="text-text">
                  <td className="px-4 py-3 font-medium">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{u.email}</td>
                  <td className="px-4 py-3 text-text-muted">{u._count.orders}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                      className={cn(
                        "rounded-full border-none px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yvann-gold-500",
                        ROLE_TONE[u.role]
                      )}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
