// src/server/api/routers/admin/property.ts
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

export const adminPropertyRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.property.findMany({ include: { owner: true } });
  }),

  getById: adminProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.db.property.findUnique({ where: { id: input }, include: { owner: true } })
  ),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        price: z.number().positive(),
        location: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.property.update({
        where: { id: input.id },
        data: {
          title: input.title,
          price: input.price,
          location: input.location,
        },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.db.property.delete({ where: { id: input.id } });
  }),
});