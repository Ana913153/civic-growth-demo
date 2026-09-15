import { promisify } from "node:util";
import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import type { Response } from "express";
import type { User } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { createLocalAccount, createPasswordResetRequest, findLocalAccountByEmail, getUserById, updateLocalPassword } from "./db";

const scrypt = promisify(scryptCallback);
export const EMAIL_SESSION_COOKIE = "northstar_email_session";

function secretKey() {
  const secret = ENV.cookieSecret || "development-only-change-this-secret";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hex, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export async function createEmailAccount(email: string, password: string, name?: string) {
  const user = await createLocalAccount({
    openId: `email:${randomUUID()}`,
    email,
    name: name || email.split("@")[0],
    loginMethod: "email",
    passwordHash: await hashPassword(password),
  });
  return user;
}

export async function authenticateEmail(email: string, password: string) {
  const account = await findLocalAccountByEmail(email);
  if (!account || !(await verifyPassword(password, account.passwordHash))) return null;
  return getUserById(account.userId);
}

export async function changeEmailPassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await getUserById(userId);
  if (!user?.email) return false;
  const account = await findLocalAccountByEmail(user.email);
  if (!account || !(await verifyPassword(currentPassword, account.passwordHash))) return false;
  await updateLocalPassword(userId, await hashPassword(newPassword));
  return true;
}

export async function requestPasswordReset(email: string) {
  const account = await findLocalAccountByEmail(email);
  if (!account) return;
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await createPasswordResetRequest(email, tokenHash, expiresAt);
  // The token is intentionally not returned. A configured email provider must deliver it.
}

export async function issueEmailSession(res: Response, req: Parameters<typeof getSessionCookieOptions>[0], user: User) {
  const token = await new SignJWT({ userId: user.id, kind: "email" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
  res.cookie(EMAIL_SESSION_COOKIE, token, { ...getSessionCookieOptions(req), maxAge: 30 * 24 * 60 * 60 * 1000 });
}

export async function userFromEmailSession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.kind !== "email" || typeof payload.userId !== "number") return null;
    return getUserById(payload.userId);
  } catch {
    return null;
  }
}

export function clearEmailSession(res: Response, req: Parameters<typeof getSessionCookieOptions>[0]) {
  res.clearCookie(EMAIL_SESSION_COOKIE, { ...getSessionCookieOptions(req), maxAge: -1 });
  res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(req), maxAge: -1 });
}
