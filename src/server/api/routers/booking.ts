import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const bookingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      propertyId: z.string().cuid(),
      startDate: z.string().transform((val) => new Date(val)),
      endDate: z.string().transform((val) => new Date(val)),
    }))
    .mutation(async ({ ctx, input }) => {
      const conflict = await ctx.db.booking.findFirst({
        where: {
          propertyId: input.propertyId,
          status: "CONFIRMED",
          OR: [
            {
              startDate: { lte: input.endDate },
              endDate: { gte: input.startDate },
            },
          ],
        },
      });

      if (conflict) {
        throw new Error("This property is already booked for the selected dates.");
      }
      const booking = await ctx.db.booking.create({
        data: {
          userId: ctx.session.user.id,
          propertyId: input.propertyId,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });
      return booking;
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.booking.findMany({
      where: { userId: ctx.session.user.id },
      include: { property: true },
    });
  }),

  getAll: protectedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.booking.findMany({
        where: {
          userId: ctx.session.user.id,
          status: input?.status,
        },
        include: {
          property: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getByProperty: protectedProcedure
  .input(z.object({ propertyId: z.string() }))
  .query(async ({ ctx, input }) => {
    const property = await ctx.db.property.findUnique({
      where: { id: input.propertyId },
    });

    if (!property || property.ownerId !== ctx.session.user.id) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return ctx.db.booking.findMany({
      where: { propertyId: input.propertyId },
      orderBy: { startDate: "asc" },
    });
  }),


  cancel: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new Error("Booking not found.");
      }

      // ✅ Safety check to prevent cancelling someone else's booking
      const isAdmin = ctx.session.user.role === "ADMIN";

      if (!isAdmin && booking.userId !== ctx.session.user.id) {
        throw new Error("You are not authorized to cancel this booking.");
      }

      return ctx.db.booking.update({
        where: { id: input.bookingId },
        data: { status: "CANCELLED" },
      });
    }),

  getBookedDates: protectedProcedure
  .input(z.object({ propertyId: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.booking.findMany({
      where: {
        propertyId: input.propertyId,
        status: "CONFIRMED",
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });
  }),
});
