"use client";

import { usePathname } from "next/navigation";
import { IconSearch, IconBell, IconUserCircle } from "@tabler/icons-react";

const TITLES: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/produits": "Produits",
  "/admin/categories": "Catégories & marques",
  "/admin/commandes": "Commandes",
  "/admin/clients": "Clients",
  "/admin/utilisateurs": "Utilisateurs internes",
  "/admin/paiements": "Paiements",
  "/admin/promotions": "Promotions",
  "/admin/contenu": "Contenu",
  "/admin/avis": "Avis",
  "/admin/notifications": "Notifications",
  "/admin/statistiques": "Statistiques",
  "/admin/parametres": "Paramètres",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Admin";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-surface px-6 dark:border-slate-800">
      <h1 className="text-lg font-semibold text-text">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 dark:border-slate-700 sm:flex">
          <IconSearch size={15} className="text-text-muted" />
          <input
            placeholder="Rechercher..."
            className="w-40 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <button aria-label="Notifications" className="relative rounded-full p-2 text-text-muted hover:text-text">
          <IconBell size={19} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-yvann-danger" />
        </button>
        <button aria-label="Profil" className="rounded-full text-text-muted hover:text-text">
          <IconUserCircle size={26} />
        </button>
      </div>
    </header>
  );
}
