// src/server/api/routers/admin/user.ts
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const adminUserRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: { name: "asc" },
    });
  }),

  getById: adminProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.db.user.findUnique({ where: { id: input } })
  ),

  updateRole: adminProcedure.input(
    z.object({ id: z.string(), name: z.string().optional(), role: z.enum(["USER", "AGENT", "ADMIN"]) })
  ).mutation(async ({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: input.id },
      data: {
        name: input.name,
        role: input.role,
      },
    });
  }),

  // Update user
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(["USER", "AGENT", "ADMIN"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // 🚫 Prevent self-demotion
      if (ctx.session.user.id === input.id && input.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot remove your own admin access.",
        });
      }
      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name ?? undefined,
          email: input.email ?? undefined,
          role: input.role,
        },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.db.user.delete({ where: { id: input.id } });
  }),
});