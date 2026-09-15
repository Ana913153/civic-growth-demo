import { randomUUID } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import type { Request, Response } from "express";
import { findAdminByUsername, touchAdminLogin } from "./db";
import { verifyPassword } from "./emailAuth";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";

export const ADMIN_SESSION_COOKIE = "northstar_admin_session";

function secretKey() {
  return new TextEncoder().encode(ENV.cookieSecret || "development-only-change-this-secret");
}

export async function authenticateAdmin(username: string, password: string) {
  const admin = await findAdminByUsername(username);
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) return null;
  await touchAdminLogin(admin.id);
  return admin;
}

export async function issueAdminSession(res: Response, req: Request, adminId: number, username: string) {
  const token = await new SignJWT({ adminId, username, kind: "admin", nonce: randomUUID() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());
  res.cookie(ADMIN_SESSION_COOKIE, token, { ...getSessionCookieOptions(req), maxAge: 12 * 60 * 60 * 1000 });
}

export async function adminFromRequest(req: Request) {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.kind !== "admin" || typeof payload.adminId !== "number" || typeof payload.username !== "string") return null;
    return { id: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}

export function clearAdminSession(res: Response, req: Request) {
  res.clearCookie(ADMIN_SESSION_COOKIE, { ...getSessionCookieOptions(req), maxAge: -1 });
}
