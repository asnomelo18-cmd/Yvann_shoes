export const ADMIN_SECTIONS = [
  { key: "produits", label: "Produits" },
  { key: "commandes", label: "Commandes" },
  { key: "paiements", label: "Paiements" },
  { key: "clients", label: "Clients" },
  { key: "categories", label: "Catégories & marques" },
  { key: "promotions", label: "Promotions" },
  { key: "contenu", label: "Contenu" },
  { key: "avis", label: "Avis" },
  { key: "statistiques", label: "Statistiques" },
  { key: "notifications", label: "Notifications" },
] as const;

export type SectionKey = (typeof ADMIN_SECTIONS)[number]["key"];

// Rôles dont l'accès est configurable. ADMIN a toujours accès à tout (suprême,
// non modifiable) ; Utilisateurs internes et Paramètres restent réservés à
// ADMIN uniquement quel que soit ce qui est configuré ici, pour éviter qu'un
// rôle inférieur ne s'auto-promeuve ou ne change les numéros de paiement.
export const CONFIGURABLE_ROLES = ["MANAGER", "SUPPORT", "VENDEUR"] as const;
export type ConfigurableRole = (typeof CONFIGURABLE_ROLES)[number];

export type PermissionMatrix = Record<ConfigurableRole, SectionKey[]>;

export const DEFAULT_PERMISSIONS: PermissionMatrix = {
  MANAGER: ADMIN_SECTIONS.map((s) => s.key) as SectionKey[],
  SUPPORT: ["commandes", "paiements", "clients", "avis"],
  VENDEUR: ["produits", "commandes", "categories"],
};

export function sectionKeyForPath(pathname: string): SectionKey | "always-admin-only" | null {
  if (pathname === "/admin") return null; // vue d'ensemble : accessible à tous les rôles staff
  if (pathname.startsWith("/admin/utilisateurs")) return "always-admin-only";
  if (pathname.startsWith("/admin/parametres")) return "always-admin-only";
  if (pathname.startsWith("/admin/permissions")) return "always-admin-only";

  for (const section of ADMIN_SECTIONS) {
    if (pathname.startsWith(`/admin/${section.key}`)) return section.key;
  }
  return null;
}
