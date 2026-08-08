import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

const ADMIN_ROLES = ["ADMIN", "MANAGER", "SUPPORT", "VENDEUR"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/compte")) {
    const token = request.cookies.get("yvann_access_token")?.value;

    if (!token) {
      const loginUrl = new URL("/connexion", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const payload = await verifyAccessToken(token);

      if (pathname.startsWith("/admin") && !ADMIN_ROLES.includes(payload.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      const loginUrl = new URL("/connexion", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
