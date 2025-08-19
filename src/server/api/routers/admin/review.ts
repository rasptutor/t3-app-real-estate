// src/server/api/routers/admin/review.ts

import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const adminReviewRouter = createTRPCRouter({
  delete: adminProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.review.delete({
        where: { id: input.reviewId },
      });
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.review.findMany({
      include: {
        user: true,
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
