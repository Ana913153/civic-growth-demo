import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { emailSignups, InsertEmailSignup, InsertUser, localAccounts, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createEmailSignup(input: InsertEmailSignup) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(emailSignups).values(input).onDuplicateKeyUpdate({
    set: { consent: input.consent, source: input.source },
  });
}

export async function listEmailSignups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSignups).orderBy(desc(emailSignups.createdAt));
}

export async function listUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, demoCredits: users.demoCredits }).from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserDemoCredits(id: number, demoCredits: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ demoCredits }).where(eq(users.id, id));
  return getUserById(id);
}

export async function findLocalAccountByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(localAccounts).where(eq(localAccounts.email, email)).limit(1);
  return result[0];
}

export async function createLocalAccount(input: { openId: string; email: string; name: string; loginMethod: string; passwordHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await findLocalAccountByEmail(input.email);
  if (existing) throw new Error("该邮箱已经注册");
  const result = await db.insert(users).values({
    openId: input.openId,
    email: input.email,
    name: input.name,
    loginMethod: input.loginMethod,
    role: "user",
    demoCredits: 0,
  });
  const userId = Number(result[0].insertId);
  await db.insert(localAccounts).values({ userId, email: input.email, passwordHash: input.passwordHash });
  return getUserById(userId);
}
