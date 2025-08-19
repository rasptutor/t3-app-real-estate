// src/server/api/routers/admin/booking.ts
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const adminBookingRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.booking.findMany({
      include: { user: true, property: true },
      orderBy: { startDate: "desc" },
    });
  }),

  cancel: adminProcedure.input(z.object({ bookingId: z.string() })).mutation(({ ctx, input }) => {
    return ctx.db.booking.update({
      where: { id: input.bookingId },
      data: { status: "CANCELLED" },
    });
  }),

  updateStatus: adminProcedure.input(z.object({
    bookingId: z.string(),
    status: z.enum(["CONFIRMED", "CANCELLED"]),
  })).mutation(({ ctx, input }) =>
    ctx.db.booking.update({
      where: { id: input.bookingId },
      data: { status: input.status },
    })
  ),

  reschedule: adminProcedure.input(
    z.object({
      bookingId: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
  ).mutation(({ ctx, input }) => {
    return ctx.db.booking.update({
      where: { id: input.bookingId },
      data: {
        startDate: input.startDate,
        endDate: input.endDate,
        status: "CONFIRMED",
      },
    });
  }),

  delete: adminProcedure.input(z.string()).mutation(({ ctx, input }) =>
    ctx.db.booking.delete({ where: { id: input } })
  ),
  
});
