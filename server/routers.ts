import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SYNTHETIC_METRICS } from "../drizzle/schema";
import { createEmailSignup, listEmailSignups } from "./db";
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

  admin: router({
    overview: adminProcedure.query(async () => ({
      signups: await listEmailSignups(),
      syntheticMetrics: SYNTHETIC_METRICS,
      disclaimer: "Synthetic projection data only — not tied to real people, accounts, or funds.",
    })),
  }),
});

export type AppRouter = typeof appRouter;
