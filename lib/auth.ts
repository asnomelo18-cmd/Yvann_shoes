import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET ?? "";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET ?? "";

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

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as AccessTokenPayload;
}

// TODO OAuth (Google, Facebook, GitHub, Apple) : à brancher via NextAuth
// providers dans app/api/auth/[...nextauth]/route.ts
// TODO OTP : générer un code 6 chiffres, stocker un hash + expiration (ex. Redis ou table dédiée)
// TODO 2FA : TOTP avec la librairie "otplib", secret stocké sur User.twoFactorSecret
