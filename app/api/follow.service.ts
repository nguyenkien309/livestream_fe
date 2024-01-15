import { db } from "@/lib/db";
import { getCurrentUser } from "./auth.service";

export const getFollowedUsers = async () => {
  try {
    const currentUser = await getCurrentUser();

    const followedUsers = db.follow.findMany({
      where: {
        followerId: currentUser.id,
        following: {
          blocking: {
            none: {
              blockedId: currentUser.id,
            },
          },
        },
      },
      include: {
        following: true,
      },
    });

    return followedUsers;
  } catch {
    return [];
  }
};

export const checkFollowUser = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === currentUser.id) {
      return true;
    }

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: otherUser.id,
      },
    });

    return !!existingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (id: string) => {
  const currentUser = await getCurrentUser();

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === currentUser.id) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: currentUser.id,
      followingId: otherUser.id,
    },
  });

  if (existingFollow) {
    throw new Error("Already following");
  }

  const follow = await db.follow.create({
    data: {
      followerId: currentUser.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });

  return follow;
};

export const unfollowUser = async (id: string) => {
  const currentUser = await getCurrentUser();

  const otherUser = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === currentUser.id) {
    throw new Error("Cannot unfollow yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: currentUser.id,
      followingId: otherUser.id,
    },
  });

  if (!existingFollow) {
    throw new Error("Not following");
  }

  const follow = await db.follow.delete({
    where: {
      id: existingFollow.id,
    },
    include: {
      following: true,
    },
  });

  return follow;
};
