"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconShoe,
  IconTags,
  IconPackage,
  IconUsers,
  IconUserShield,
  IconWallet,
  IconDiscount2,
  IconPhoto,
  IconStar,
  IconBell,
  IconSettings,
  IconChartBar,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Vue d'ensemble", href: "/admin", icon: IconLayoutDashboard },
  { label: "Produits", href: "/admin/produits", icon: IconShoe },
  { label: "Catégories & marques", href: "/admin/categories", icon: IconTags },
  { label: "Commandes", href: "/admin/commandes", icon: IconPackage },
  { label: "Clients", href: "/admin/clients", icon: IconUsers },
  { label: "Utilisateurs internes", href: "/admin/utilisateurs", icon: IconUserShield },
  { label: "Paiements", href: "/admin/paiements", icon: IconWallet },
  { label: "Promotions", href: "/admin/promotions", icon: IconDiscount2 },
  { label: "Contenu", href: "/admin/contenu", icon: IconPhoto },
  { label: "Avis", href: "/admin/avis", icon: IconStar },
  { label: "Notifications", href: "/admin/notifications", icon: IconBell },
  { label: "Statistiques", href: "/admin/statistiques", icon: IconChartBar },
  { label: "Paramètres", href: "/admin/parametres", icon: IconSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-surface dark:border-slate-800 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <img src="/logo/rho-mark-dark.svg" alt="RHO" className="h-6 w-auto dark:hidden" />
        <img src="/logo/rho-mark.svg" alt="RHO" className="hidden h-6 w-auto dark:block" />
        <span className="text-xs font-medium text-text-muted">Admin</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {SECTIONS.map((section) => {
          const isActive = pathname === section.href;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-rho-blue-600 text-white"
                  : "text-text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <section.icon size={18} />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
