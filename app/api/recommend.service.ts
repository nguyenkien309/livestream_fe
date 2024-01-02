import { db } from "../../lib/db";
import { getSelf } from "./auth.service";
import { resolve } from "path";

export const getRecommended = async () => {
  // Check skeleton
  // await new Promise(resolve => setTimeout(resolve, 5000))

  let userId;
  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let users = [];

  if (userId) {
    users = await db.user.findMany({
      where: {
        AND: [
          {
            // Not get current user
            NOT: {
              id: userId,
            },
          },
          {
            // Table user
            // Not take users followed by current user for recommened list
            NOT: {
              followedBy: {
                some: { followerId: userId },
              },
            },
          },
          {
            // Not take users blocked by current user
            NOT: {
              blocking: {
                some: { blockedId: userId },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return users;
};
