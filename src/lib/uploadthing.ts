// src/lib/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  propertyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Uploaded file:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
