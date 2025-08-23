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
          //imageUrl: input.images[0]!.url,
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
    .input(z.object({
      search: z.string().optional(),
      type: z.string().optional(),
      beds: z.number().int().optional(),
      baths: z.number().int().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      from: z.string().optional(),
      sort: z.enum(["priceAsc", "priceDesc", "latest"]).optional(),
      page: z.number().default(1),      
      limit: z.number().default(1), // 👈 adjust per-page size
      listingType: z.enum(["sale", "rent"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { search, type, beds, baths, min, max, sort, page, limit, listingType } = input;

      // Build where filter
      const where: any = {
        listingType,
        propertyType: type,
        bedrooms: beds,
        bathrooms: baths,
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }
      if (type) where.propertyType = type;
      if (beds) where.bedrooms = { gte: beds };
      if (baths) where.bathrooms = { gte: baths };
      if (min || max) where.price = { gte: min ?? undefined, lte: max ?? undefined };
      if (listingType) where.listingType = listingType;

      const totalCount = await ctx.db.property.count({ where });      

      let orderBy: any;
      if (sort === "priceAsc") {
        orderBy = { price: "asc" };
      } else if (sort === "priceDesc") {
        orderBy = { price: "desc" };      
      } else {
        // latest by default
        orderBy = { createdAt: "desc" };
      }

      const properties = await ctx.db.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          agent: true,
          agency: true,
          images: true, // 👈 load related PropertyImage records
          owner: true,          
        },
          
      });

      return {
        properties,
        totalPages: Math.ceil(totalCount / limit),
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

