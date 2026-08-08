"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconSearch } from "@tabler/icons-react";
import { formatPrice } from "@/lib/utils";

interface AdminClient {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  usualSize: number | null;
  loyaltyPoints: number;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminClientsPage() {
  const [query, setQuery] = useState("");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin", "clients"],
    queryFn: async () => {
      const res = await fetch("/api/admin/clients");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.clients as AdminClient[];
    },
  });

  const filtered = (clients ?? []).filter(
    (c) =>
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase().includes(query.toLowerCase())
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
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Pointure habituelle</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Total dépensé</th>
              <th className="px-4 py-3">Points fidélité</th>
              <th className="px-4 py-3">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                  Aucun client trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="text-text">
                  <td className="px-4 py-3 font-medium">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-text-muted">{c.usualSize ?? "—"}</td>
                  <td className="px-4 py-3 text-text-muted">{c.orderCount}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-text-muted">{c.loyaltyPoints}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(c.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
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
