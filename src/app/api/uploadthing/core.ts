// src/app/api/uploadthing/core.ts

import { auth } from "@/server/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import {UploadThingError} from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {      
      maxFileSize: "4MB",
      maxFileCount: 6,
    },
  }) 
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session) {
        throw new UploadThingError("You need to be logged in to upload files");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:");
      console.log("file url", file.url);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { 
        url: file.url,
        key: file.key, 
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;