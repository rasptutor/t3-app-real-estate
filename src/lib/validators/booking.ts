// src/lib/validators/booking.ts
import { z } from "zod";

export const createBookingSchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});
