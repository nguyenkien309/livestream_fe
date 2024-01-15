import { createUploadthing, type FileRouter } from "uploadthing/next";

import { db } from "@/lib/db";
import { getCurrentUser } from "../auth.service";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      const currentUser = await getCurrentUser();

      return { user: currentUser }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.stream.update({
        where: {
          userId: metadata.user.id,
        },
        data: {
          thumbnailUrl: file.url,
        },
      });

      return { fileUrl: file.url };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;