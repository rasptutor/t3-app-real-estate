// src/schemas/property.ts
import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  imageUrl: z.string().url(),
  price: z.coerce.number().positive(),
  propertyType: z.enum(["Apartment", "House", "Villa", "Cottage"]),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  availableFrom: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
