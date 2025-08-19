// src/server/api/routers/review.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure.input(
    z.object({
      bookingId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().min(1),
    })
  ).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.review.findUnique({
      where: { bookingId: input.bookingId },
    });

    if (existing) {
      throw new Error("You have already reviewed this booking.");
    }

    const booking = await ctx.db.booking.findUnique({
      where: { id: input.bookingId },
      include: { property: true },
    });

    if (!booking) throw new Error("Booking not found.");

    return ctx.db.review.create({
      data: {
        rating: input.rating,
        comment: input.comment,
        booking: { connect: { id: input.bookingId } },
        property: { connect: { id: booking.propertyId } },
        user: { connect: { id: ctx.session.user.id } },        
      },
    });
  }),

  getByProperty: publicProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.review.findMany({
        where: { propertyId: input.propertyId },
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
});
