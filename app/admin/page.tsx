"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { IconCash, IconPackage, IconUserPlus, IconAlertTriangle, IconClockHour4 } from "@tabler/icons-react";
import { StatCard, StatCardSkeleton } from "@/components/cards/StatCard";
import { useAdminPayments } from "@/services/admin";
import { useSession } from "@/services/auth";
import { useMyPermissions, canAccessSection } from "@/services/permissions";
import { formatPrice } from "@/lib/utils";

interface OverviewStats {
  revenueThisMonth: number;
  ordersToday: number;
  newCustomersThisMonth: number;
  lowStockVariants: number;
}

export default function AdminOverviewPage() {
  const { data: session } = useSession();
  const { data: permData } = useMyPermissions();
  const canSeePayments = canAccessSection(session?.role, "paiements", permData?.permissions);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "overview-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/overview-stats");
      if (!res.ok) throw new Error("Chargement impossible.");
      return res.json() as Promise<OverviewStats>;
    },
  });

  // Le bandeau paiements en attente n'est chargé que si le rôle y a accès —
  // évite de spammer des 403 pour les rôles qui n'ont pas cette permission.
  const { data: pendingPayments } = useAdminPayments("EN_ATTENTE", canSeePayments);
  const pending = canSeePayments ? pendingPayments ?? [] : [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsLoading || !stats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Chiffre d'affaires (mois)"
              value={formatPrice(Number(stats.revenueThisMonth))}
              icon={IconCash}
            />
            <StatCard label="Commandes du jour" value={String(stats.ordersToday)} icon={IconPackage} />
            <StatCard
              label="Nouveaux clients (mois)"
              value={String(stats.newCustomersThisMonth)}
              icon={IconUserPlus}
              tone="success"
            />
            <StatCard
              label="Variantes en rupture (≤3)"
              value={String(stats.lowStockVariants)}
              icon={IconAlertTriangle}
              tone={stats.lowStockVariants > 0 ? "danger" : "default"}
            />
          </>
        )}
      </div>

      {canSeePayments && pending.length > 0 && (
        <div className="mt-8 rounded-2xl border border-yvann-warning/30 bg-yvann-warning/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <IconClockHour4 className="shrink-0 text-yvann-warningText" size={22} />
              <div>
                <p className="text-sm font-medium text-text">
                  {pending.length} paiement{pending.length > 1 ? "s" : ""} en attente de validation
                </p>
                <p className="text-xs text-text-muted">
                  Total à vérifier : {formatPrice(pending.reduce((s, p) => s + p.amount, 0))}
                </p>
              </div>
            </div>
            <Link
              href="/admin/paiements"
              className="rounded-full bg-yvann-gold-600 px-4 py-2 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
            >
              Traiter maintenant
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
