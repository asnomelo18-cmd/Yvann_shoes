"use client";

import { useQuery } from "@tanstack/react-query";
import {
  IconCash,
  IconUsers,
  IconStarOff,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { StatCard, StatCardSkeleton } from "@/components/cards/StatCard";
import { formatPrice } from "@/lib/utils";

const ORDER_STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  PREPARATION: "Préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

interface StatsResponse {
  topProducts: { name: string; unitsSold: number }[];
  ordersByStatus: { status: string; count: number }[];
  totalCustomers: number;
  pendingReviews: number;
  lowStockVariants: number;
  totalRevenue: number;
}

export default function AdminStatistiquesPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Chargement impossible.");
      return res.json() as Promise<StatsResponse>;
    },
  });

  const maxCount = Math.max(...(stats?.ordersByStatus.map((o) => o.count) ?? [1]), 1);
  const maxUnits = Math.max(...(stats?.topProducts.map((p) => p.unitsSold) ?? [1]), 1);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !stats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Chiffre d'affaires (payé+)" value={formatPrice(Number(stats.totalRevenue))} icon={IconCash} />
            <StatCard label="Clients" value={String(stats.totalCustomers)} icon={IconUsers} />
            <StatCard label="Avis en attente" value={String(stats.pendingReviews)} icon={IconStarOff} tone="warning" />
            <StatCard label="Variantes en rupture (≤3)" value={String(stats.lowStockVariants)} icon={IconAlertTriangle} tone="danger" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h3 className="mb-4 text-sm font-semibold text-text">Modèles les plus vendus</h3>
          {isLoading || !stats ? (
            <p className="text-text-muted">Chargement...</p>
          ) : stats.topProducts.length === 0 ? (
            <p className="text-sm text-text-muted">Pas encore de ventes.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>{p.name}</span>
                    <span>{p.unitsSold} vendus</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-2">
                    <div
                      className="h-2 rounded-full bg-yvann-gold-600"
                      style={{ width: `${(p.unitsSold / maxUnits) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h3 className="mb-4 text-sm font-semibold text-text">Commandes par statut</h3>
          {isLoading || !stats ? (
            <p className="text-text-muted">Chargement...</p>
          ) : stats.ordersByStatus.length === 0 ? (
            <p className="text-sm text-text-muted">Pas encore de commandes.</p>
          ) : (
            <div className="space-y-3">
              {stats.ordersByStatus.map((o) => (
                <div key={o.status}>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>{ORDER_STATUS_LABELS[o.status] ?? o.status}</span>
                    <span>{o.count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-2">
                    <div
                      className="h-2 rounded-full bg-yvann-bronze-500"
                      style={{ width: `${(o.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
