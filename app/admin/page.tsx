"use client";

import Link from "next/link";
import { IconCash, IconPackage, IconUserPlus, IconTrendingUp, IconClockHour4 } from "@tabler/icons-react";
import { StatCard } from "@/components/cards/StatCard";
import { useAdminPayments } from "@/services/admin";
import { formatPrice } from "@/lib/utils";

// TODO : les 4 StatCards du haut restent à agréger réellement (services/admin-stats.ts,
// endpoint /api/admin/stats) — chiffre d'affaires, commandes du jour, nouveaux clients, conversion.
export default function AdminOverviewPage() {
  const { data: pendingPayments } = useAdminPayments("EN_ATTENTE");
  const pending = pendingPayments ?? [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Chiffre d'affaires (mois)" value={formatPrice(1284000)} icon={IconCash} />
        <StatCard label="Commandes du jour" value="14" icon={IconPackage} />
        <StatCard label="Nouveaux clients" value="8" icon={IconUserPlus} tone="success" />
        <StatCard label="Taux de conversion" value="3,2 %" icon={IconTrendingUp} />
      </div>

      {pending.length > 0 && (
        <div className="mt-8 rounded-2xl border border-rho-warning/30 bg-rho-warning/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconClockHour4 className="text-rho-warning" size={22} />
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
              className="rounded-full bg-rho-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rho-blue-700"
            >
              Traiter maintenant
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
