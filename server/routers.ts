import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SYNTHETIC_METRICS } from "../drizzle/schema";
import { createEmailSignup, getUserById, listEmailSignups, listUsers, updateUserDemoCredits } from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "管理员权限 required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  public: router({
    overview: publicProcedure.query(() => ({
      headline: 1000,
      activeIllustrations: 12840,
      projectionRange: "2026–2050",
      metrics: SYNTHETIC_METRICS,
    })),
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().trim().email().max(320),
          consent: z.literal(true),
          source: z.string().trim().max(64).default("homepage"),
        }),
      )
      .mutation(async ({ input }) => {
        await createEmailSignup({
          email: input.email.toLowerCase(),
          consent: input.consent,
          source: input.source,
        });
        return { ok: true } as const;
      }),
  }),

  account: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      return {
        id: ctx.user.id,
        name: user?.name || ctx.user.name || "账户用户",
        email: user?.email || ctx.user.email || "",
        demoCredits: user?.demoCredits ?? 0,
        disclaimer: "这是虚构演示积分，不是现金、存款、投资资产或可提现余额。",
      };
    }),
  }),

  admin: router({
    overview: adminProcedure.query(async () => ({
      signups: await listEmailSignups(),
      users: await listUsers(),
      syntheticMetrics: SYNTHETIC_METRICS,
      disclaimer: "仅为合成预测数据，不对应真实个人、账户或资金。",
    })),
    setDemoCredits: adminProcedure
      .input(z.object({ userId: z.number().int().positive(), demoCredits: z.number().int().min(0).max(100000000) }))
      .mutation(async ({ input }) => {
        const user = await updateUserDemoCredits(input.userId, input.demoCredits);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "用户不存在" });
        return { ok: true, userId: user.id, demoCredits: user.demoCredits } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
