import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
  });

  if (!user) {
    throw new Error("Not found");
  }

  return user;
};

/**
 * Explanation:
 * -> Dashboard rendering solution when using dynamic username route
 * -> In case of render dashboard for current user
 *    + Checking current user logged in and dynamic username on router is the same or not
 * -> Based on that will allow to render dashboard or not
 * NOTE:
 * -> Several similar live streaming websites are using this same solution
 * Scalability:
 * -> Something like features admins, moderators to handle while live streaming
 */
export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (self.username !== user.username) {
    throw new Error("Unauthorized");
  }

  return user;
};
