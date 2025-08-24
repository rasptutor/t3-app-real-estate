import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { propertyRouter } from "./routers/property";
import { bookingRouter } from "./routers/booking";
import { adminRouter } from "./routers/admin";
import { reviewRouter } from "./routers/review";
import { agencyRouter } from "./routers/agency";
import { bondRouter } from "./routers/bond";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  property: propertyRouter,
  booking: bookingRouter,
  admin: adminRouter,
  review: reviewRouter,
  agency: agencyRouter,
  bond: bondRouter,  
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
