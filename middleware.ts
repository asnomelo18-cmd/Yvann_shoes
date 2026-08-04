import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

const ADMIN_ROLES = ["ADMIN", "MANAGER", "SUPPORT", "VENDEUR"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("yvann_access_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
    try {
      const payload = verifyAccessToken(token);
      if (!ADMIN_ROLES.includes(payload.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
