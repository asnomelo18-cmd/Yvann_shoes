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
  IconShieldLock,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/services/auth";
import { useMyPermissions, canAccessSection } from "@/services/permissions";
import type { SectionKey } from "@/lib/permissions";

interface SidebarSection {
  label: string;
  href: string;
  icon: typeof IconLayoutDashboard;
  section: SectionKey | "overview" | "always-admin-only";
}

const SECTIONS: SidebarSection[] = [
  { label: "Vue d'ensemble", href: "/admin", icon: IconLayoutDashboard, section: "overview" },
  { label: "Produits", href: "/admin/produits", icon: IconShoe, section: "produits" },
  { label: "Catégories & marques", href: "/admin/categories", icon: IconTags, section: "categories" },
  { label: "Commandes", href: "/admin/commandes", icon: IconPackage, section: "commandes" },
  { label: "Clients", href: "/admin/clients", icon: IconUsers, section: "clients" },
  { label: "Paiements", href: "/admin/paiements", icon: IconWallet, section: "paiements" },
  { label: "Promotions", href: "/admin/promotions", icon: IconDiscount2, section: "promotions" },
  { label: "Contenu", href: "/admin/contenu", icon: IconPhoto, section: "contenu" },
  { label: "Avis", href: "/admin/avis", icon: IconStar, section: "avis" },
  { label: "Notifications", href: "/admin/notifications", icon: IconBell, section: "notifications" },
  { label: "Statistiques", href: "/admin/statistiques", icon: IconChartBar, section: "statistiques" },
  { label: "Utilisateurs internes", href: "/admin/utilisateurs", icon: IconUserShield, section: "always-admin-only" },
  { label: "Permissions", href: "/admin/permissions", icon: IconShieldLock, section: "always-admin-only" },
  { label: "Paramètres", href: "/admin/parametres", icon: IconSettings, section: "always-admin-only" },
];

function SidebarContent({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: permData } = useMyPermissions();

  const visibleSections = SECTIONS.filter((s) => {
    if (s.section === "overview") return true;
    if (s.section === "always-admin-only") return session?.role === "ADMIN";
    return canAccessSection(session?.role, s.section, permData?.permissions);
  });

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <img src="/logo/yvann-mark-dark.svg" alt="Yvann" className="h-6 w-auto dark:hidden" />
          <img src="/logo/yvann-mark.svg" alt="Yvann" className="hidden h-6 w-auto dark:block" />
          <span className="text-xs font-medium text-text-muted">Admin</span>
        </div>
        {onClose && (
          <button
            aria-label="Fermer le menu"
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:text-text lg:hidden"
          >
            <IconX size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {visibleSections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <Link
              key={section.href}
              href={section.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-yvann-gold-600 text-yvann-black-950"
                  : "text-text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <section.icon size={18} />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AdminSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Sidebar desktop, toujours visible à partir de lg */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-surface dark:border-slate-800 lg:flex">
        <SidebarContent />
      </aside>

      {/* Drawer mobile/tablette, ouvert via le bouton menu de la topbar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-surface shadow-2xl">
            <SidebarContent onNavigate={onClose} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
