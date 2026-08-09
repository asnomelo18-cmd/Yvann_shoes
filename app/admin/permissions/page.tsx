"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconDeviceFloppy, IconInfoCircle } from "@tabler/icons-react";
import { ADMIN_SECTIONS, CONFIGURABLE_ROLES, DEFAULT_PERMISSIONS, type PermissionMatrix } from "@/lib/permissions";
import { useMyPermissions, useSavePermissions } from "@/services/permissions";

const ROLE_LABELS: Record<string, string> = {
  MANAGER: "Manager",
  SUPPORT: "Support",
  VENDEUR: "Vendeur",
};

export default function AdminPermissionsPage() {
  const { data, isLoading } = useMyPermissions();
  const save = useSavePermissions();
  const [matrix, setMatrix] = useState<PermissionMatrix>(DEFAULT_PERMISSIONS);

  useEffect(() => {
    if (data?.permissions) setMatrix(data.permissions);
  }, [data]);

  function toggle(role: (typeof CONFIGURABLE_ROLES)[number], section: string) {
    setMatrix((m) => {
      const current = m[role] ?? [];
      const next = current.includes(section as any)
        ? current.filter((s) => s !== section)
        : [...current, section as any];
      return { ...m, [role]: next };
    });
  }

  function handleSave() {
    save.mutate(matrix, {
      onSuccess: () => toast.success("Permissions enregistrées."),
      onError: () => toast.error("Enregistrement impossible."),
    });
  }

  if (isLoading) return <p className="text-text-muted">Chargement...</p>;

  return (
    <div>
      <div className="flex items-start gap-3 rounded-2xl border border-yvann-gold-600/30 bg-yvann-gold-600/5 p-4 text-sm text-text-muted">
        <IconInfoCircle size={18} className="mt-0.5 shrink-0 text-yvann-gold-700" />
        <p>
          Coche les sections auxquelles chaque rôle a accès. Le rôle <strong className="text-text">Admin</strong>{" "}
          a toujours accès à tout et n'apparaît pas ici. <strong className="text-text">Utilisateurs internes</strong>,{" "}
          <strong className="text-text">Paramètres</strong> et cette page restent réservés à Admin, quel que soit
          ce que tu coches.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Section</th>
              {CONFIGURABLE_ROLES.map((role) => (
                <th key={role} className="px-4 py-3 text-center">
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {ADMIN_SECTIONS.map((section) => (
              <tr key={section.key} className="text-text">
                <td className="px-4 py-3 font-medium">{section.label}</td>
                {CONFIGURABLE_ROLES.map((role) => (
                  <td key={role} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[role]?.includes(section.key) ?? false}
                      onChange={() => toggle(role, section.key)}
                      className="h-4 w-4 accent-yvann-gold-600"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        disabled={save.isPending}
        className="mt-6 flex items-center gap-2 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 hover:bg-yvann-gold-500 disabled:opacity-60"
      >
        <IconDeviceFloppy size={16} /> {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
