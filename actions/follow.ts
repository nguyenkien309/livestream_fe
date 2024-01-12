"use server";

import { getCurrentUser } from "@/app/api/auth.service";
import { followUser, unfollowUser } from "@/app/api/follow.service";
import { revalidatePath } from "next/cache";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id);

    // Reset page cache
    revalidatePath("/");

    if (followedUser) {
      revalidatePath(`/${followedUser.following.username}`);
    }

    return followedUser;
  } catch (error) {
    throw new Error("Interal Error");
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();
    const unFollowedUser = await unfollowUser(id);

    revalidatePath("/");

    if (unFollowedUser) {
      revalidatePath(`/${unFollowedUser.following.username}`);
    }

    return unFollowedUser;
  } catch (error) {
    throw new Error("Internal Error");
  }
};
