import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const refreshToken = cookies().get("rho_refresh_token")?.value;
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("rho_access_token");
  response.cookies.delete("rho_refresh_token");
  return response;
}
