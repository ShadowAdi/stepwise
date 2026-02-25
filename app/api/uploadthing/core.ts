import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  stepImageUploader: f({
    image: { maxFileSize: "10MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Auth can be added here in the future
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
