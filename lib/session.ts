import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
