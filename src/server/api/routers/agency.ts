import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const agencyRouter = createTRPCRouter({
    getAll: publicProcedure
    .query(async ({ ctx }) => {
    return await ctx.db.agency.findMany({
      orderBy: { name: "asc" },
    });
  }),
})
  
