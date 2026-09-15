import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing Manus OAuth and the fictional account center. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 16 }).default("user").notNull(),
  demoCredits: int("demoCredits").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const localAccounts = mysqlTable("local_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 512 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const emailSignups = mysqlTable("email_signups", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  consent: boolean("consent").notNull().default(true),
  source: varchar("source", { length: 64 }).notNull().default("homepage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LocalAccount = typeof localAccounts.$inferSelect;
export type EmailSignup = typeof emailSignups.$inferSelect;
export type InsertEmailSignup = typeof emailSignups.$inferInsert;

export const SYNTHETIC_METRICS = [
  { year: "2026", balance: 1000, change: 1000, label: "初始示例" },
  { year: "2030", balance: 4600, change: 3600, label: "时间 + 持续投入" },
  { year: "2040", balance: 17100, change: 12500, label: "长期预测示例" },
  { year: "2050", balance: 51200, change: 34100, label: "长期示例区间" },
];

export type SyntheticMetric = (typeof SYNTHETIC_METRICS)[number];
