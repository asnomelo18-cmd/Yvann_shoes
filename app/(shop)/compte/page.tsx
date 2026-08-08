"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconUserCircle,
  IconPackage,
  IconMapPin,
  IconHeart,
  IconBell,
  IconLogout,
} from "@tabler/icons-react";
import { useSession, useLogout } from "@/services/auth";
import { useMyOrders } from "@/services/orders";
import { formatPrice, cn } from "@/lib/utils";

const ORDER_STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  PREPARATION: "Préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

const STATUS_TONE: Record<string, string> = {
  EN_ATTENTE: "bg-yvann-warning/15 text-yvann-warningText",
  PAYEE: "bg-yvann-gold-500/15 text-yvann-gold-text",
  PREPARATION: "bg-yvann-bronze-500/15 text-yvann-bronzeText",
  EXPEDIEE: "bg-yvann-gold-500/15 text-yvann-gold-text",
  LIVREE: "bg-yvann-success/15 text-yvann-successText",
  ANNULEE: "bg-yvann-danger/15 text-yvann-danger",
  REMBOURSEE: "bg-slate-400/15 text-text-muted",
};

export default function ComptePage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const logout = useLogout();

  if (!sessionLoading && !session) {
    return (
      <div className="mx-auto max-w-md px-4 pb-20 pt-32 text-center">
        <p className="text-text-muted">Connectez-vous pour accéder à votre compte.</p>
        <button
          onClick={() => router.push("/connexion?next=/compte")}
          className="mt-4 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">Mon compte</h1>
          {session && (
            <p className="mt-1 truncate text-sm text-text-muted">
              {session.firstName} {session.lastName} · {session.email}
            </p>
          )}
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-text hover:border-yvann-danger hover:text-yvann-danger dark:border-slate-700"
        >
          <IconLogout size={16} /> Déconnexion
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: IconUserCircle, label: "Profil", desc: "Infos personnelles", href: null },
          { icon: IconMapPin, label: "Adresses", desc: "Livraison & facturation", href: null },
          { icon: IconHeart, label: "Favoris", desc: "Vos coups de cœur", href: "/favoris" },
          { icon: IconBell, label: "Notifications", desc: "Suivi & promos", href: null },
        ].map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-slate-200 p-5 text-text-muted transition-colors hover:border-yvann-gold-500 dark:border-slate-800"
            >
              <item.icon size={22} className="text-yvann-gold-text" />
              <p className="mt-3 text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs">{item.desc}</p>
            </Link>
          ) : (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 p-5 text-text-muted dark:border-slate-800"
            >
              <item.icon size={22} className="text-yvann-gold-text" />
              <p className="mt-3 text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs">{item.desc}</p>
              <p className="mt-2 text-xs italic text-text-muted">Bientôt disponible</p>
            </div>
          )
        )}
      </div>

      <div className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
          <IconPackage size={20} /> Mes commandes
        </h2>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Commande</th>
                <th className="px-4 py-3">Articles</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ordersLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                    Chargement...
                  </td>
                </tr>
              ) : !orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                    Aucune commande pour l'instant —{" "}
                    <Link href="/boutique" className="text-yvann-gold-text hover:underline">
                      découvrir la boutique
                    </Link>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="text-text">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-text-muted">{order.itemCount} paire(s)</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(Number(order.total))}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_TONE[order.status])}>
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
