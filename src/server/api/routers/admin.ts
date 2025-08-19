// src/server/api/routers/admin.ts
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { adminBookingRouter } from "./admin/booking";
import { adminUserRouter } from "./admin/user";
import { adminPropertyRouter } from "./admin/property";
import { adminReviewRouter } from "./admin/review";

export const adminRouter = createTRPCRouter({
    booking: adminBookingRouter,
    user: adminUserRouter,
    property: adminPropertyRouter,
    review: adminReviewRouter,
  getAllProperties: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return ctx.db.property.findMany({
      include: {
        owner: true,
      },
    });
  }),
  
});
