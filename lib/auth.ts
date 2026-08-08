import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? "");
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET ?? "");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";

export interface AccessTokenPayload {
  sub: string; // userId
  role: string;
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// jose (au lieu de jsonwebtoken) : compatible à la fois avec le runtime Node
// des routes API et le runtime Edge de middleware.ts. jsonwebtoken échoue
// silencieusement dans l'Edge Runtime, ce qui cassait la protection /admin.

export function signAccessToken(payload: AccessTokenPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(ACCESS_TOKEN_SECRET);
}

export function signRefreshToken(payload: AccessTokenPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
  return { sub: payload.sub as string, role: payload.role as string };
}

export async function verifyRefreshToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
  return { sub: payload.sub as string, role: payload.role as string };
}

// TODO OAuth (Google, Facebook, GitHub, Apple) : à brancher via NextAuth
// providers dans app/api/auth/[...nextauth]/route.ts
// TODO OTP : générer un code 6 chiffres, stocker un hash + expiration (ex. Redis ou table dédiée)
// TODO 2FA : TOTP avec la librairie "otplib", secret stocké sur User.twoFactorSecret
