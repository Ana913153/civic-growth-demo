import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { EMAIL_SESSION_COOKIE, userFromEmailSession } from "../emailAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  if (!user) {
    user = (await userFromEmailSession(opts.req.cookies?.[EMAIL_SESSION_COOKIE])) ?? null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
