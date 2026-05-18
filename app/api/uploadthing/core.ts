// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Router buat sneakers: max 4 foto, masing-masing max 4MB
  sneakerImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      console.log("UT_DEBUG: [MIDDLEWARE] Triggered successfully");
      return { userId: "admin_ridho" }; 
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("UT_DEBUG: [COMPLETE] Upload complete for:", metadata.userId);
      console.log("UT_DEBUG: [COMPLETE] URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;