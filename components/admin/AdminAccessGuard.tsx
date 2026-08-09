"use client";

import { usePathname } from "next/navigation";
import { IconLock } from "@tabler/icons-react";
import { useSession } from "@/services/auth";
import { useMyPermissions, canAccessSection } from "@/services/permissions";
import { sectionKeyForPath } from "@/lib/permissions";

export function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: permData, isLoading: permLoading } = useMyPermissions();

  if (sessionLoading || permLoading) {
    return <p className="text-text-muted">Chargement...</p>;
  }

  const section = sectionKeyForPath(pathname);

  let allowed = true;
  if (section === "always-admin-only") {
    allowed = session?.role === "ADMIN";
  } else if (section) {
    allowed = canAccessSection(session?.role, section, permData?.permissions);
  }
  // section === null (ex. "/admin" vue d'ensemble) → accessible à tout rôle staff

  if (!allowed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
        <IconLock size={28} className="text-text-muted" />
        <p className="text-text-muted">
          Tu n'as pas accès à cette section. Contacte un administrateur si tu penses que c'est une
          erreur.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
