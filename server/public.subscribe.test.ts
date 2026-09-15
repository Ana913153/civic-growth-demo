import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("public.subscribe", () => {
  it("rejects an email without explicit consent", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.public.subscribe({ email: "reader@example.com", consent: false, source: "homepage" }),
    ).rejects.toThrow();
  });

  it("rejects malformed email input", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.public.subscribe({ email: "not-an-email", consent: true, source: "homepage" }),
    ).rejects.toThrow();
  });
});

describe("admin.overview", () => {
  it("blocks authenticated non-admin users", async () => {
    const user: AuthenticatedUser = {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    const caller = appRouter.createCaller(createContext(user));
    await expect(caller.admin.overview()).rejects.toThrow("独立管理员账号");
  });
});
