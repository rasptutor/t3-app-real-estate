// src/server/api/routers/property.ts
import { z } from "zod";
import { publicProcedure, agentProcedure, createTRPCRouter } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const createPropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  propertyType: z.enum(["Apartment", "House", "Villa", "Cottage"]),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  availableFrom: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  images: z.array(
    z.object({
      url: z.string().url(),
      key: z.string(),       // <- new required key
    })
  ).min(1),
});

export const propertyRouter = createTRPCRouter({

    // Agent-only property creation endpoint
  create: agentProcedure
    .input(createPropertySchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const newProperty = await ctx.db.property.create({
        data: {
          ...input,
          availableFrom: new Date(input.availableFrom),
          price: Number(input.price),
          ownerId: userId,
          imageUrl: input.images[0]!.url,
          images: {
            create: input.images.map((img) => ({
              url: img.url,
              key: img.key,   // <-- save UT key for deletion
            })),
          },
        },
      });

      return newProperty;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        beds: z.coerce.number().optional(),
        baths: z.coerce.number().optional(),
        min: z.coerce.number().optional(),
        max: z.coerce.number().optional(),
        from: z.string().optional(),
        sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
        page: z.coerce.number().optional().default(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        search,
        type,
        beds,
        baths,
        min,
        max,
        from,
        sort = "newest",
        page = 1,
      } = input;

      const pageSize = 4;
      const skip = (page - 1) * pageSize;

      let orderBy: Prisma.PropertyOrderByWithRelationInput = {
        createdAt: "desc",
      };

      if (sort === "price-asc") orderBy = { price: "asc" };
      if (sort === "price-desc") orderBy = { price: "desc" };

      const where: Prisma.PropertyWhereInput = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(type && { propertyType: type }),
        ...(beds && { bedrooms: { gte: beds } }),
        ...(baths && { bathrooms: { gte: baths } }),
        ...(min || max
          ? {
              price: {
                ...(min && { gte: min }),
                ...(max && { lte: max }),
              },
            }
          : {}),
        ...(from && {
          availableFrom: {
            gte: new Date(from),
          },
        }),
      };

      const [rawProperties, total] = await Promise.all([
        ctx.db.property.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          include: { 
            owner: true,
            reviews: {
              select: { rating: true },
            }, 
          },
        }),
        ctx.db.property.count({ where }),
      ]);

      const properties = rawProperties.map((p) => {
        const ratings = p.reviews.map((r) => r.rating);
        const averageRating = ratings.length
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : null;

        return {
          ...p,
          averageRating,
          reviewCount: ratings.length,
        };
      });

      return {
        properties,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      };
    }),

  deleteImage: agentProcedure
    .input(z.object({
      propertyId: z.string(),
      imageId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check that user is agent and owns the property
      const property = await ctx.db.property.findFirst({
        where: { id: input.propertyId, ownerId: ctx.session.user.id },
        include: { images: true },
      });

      if (!property) throw new Error("Not authorized");

      const image = property.images.find(img => img.id === input.imageId);
      if (!image) throw new Error("Image not found");

      // Delete from UploadThing
      await utapi.deleteFiles(image.key);

      // Delete from DB
      await ctx.db.propertyImage.delete({
        where: { id: image.id },
      });

      return { success: true };
    }),
});

