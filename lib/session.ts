import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRolePermissions } from "@/lib/settings";
import type { SectionKey } from "@/lib/permissions";

export async function getSessionUser() {
  const token = cookies().get("yvann_access_token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || !["ADMIN", "MANAGER", "SUPPORT", "VENDEUR"].includes(user.role)) {
    return null;
  }
  return user;
}

// Le compte "admin suprême" — seul ADMIN (au sens strict) peut gérer les
// utilisateurs, les paramètres sensibles (paiement...) et les permissions
// des autres rôles. Ce contrôle n'est jamais configurable.
export async function requireSuperAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

// Contrôle d'accès à une section admin configurable (produits, commandes...).
// ADMIN a toujours accès. Les autres rôles staff dépendent de la matrice de
// permissions enregistrée par l'admin suprême dans /admin/permissions.
export async function requireSection(section: SectionKey) {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.role === "ADMIN") return user;
  if (!["MANAGER", "SUPPORT", "VENDEUR"].includes(user.role)) return null;

  const permissions = await getRolePermissions();
  const allowed = permissions[user.role as "MANAGER" | "SUPPORT" | "VENDEUR"] ?? [];
  if (!allowed.includes(section)) return null;

  return user;
}
