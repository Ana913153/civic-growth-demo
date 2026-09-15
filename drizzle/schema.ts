import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing Manus OAuth.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 16 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
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
export type EmailSignup = typeof emailSignups.$inferSelect;
export type InsertEmailSignup = typeof emailSignups.$inferInsert;

/**
 * This project intentionally does not store or display real account balances.
 * Public and admin views use clearly labeled synthetic projection data.
 */
export const SYNTHETIC_METRICS = [
  { year: "2026", balance: 1000, change: 1000, label: "Opening illustration" },
  { year: "2030", balance: 4600, change: 3600, label: "Time + contributions" },
  { year: "2040", balance: 17100, change: 12500, label: "Long-range projection" },
  { year: "2050", balance: 51200, change: 34100, label: "Illustrative horizon" },
];

export type SyntheticMetric = (typeof SYNTHETIC_METRICS)[number];
