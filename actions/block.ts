"use server";

import { blockUser, unblockUser } from "@/app/api/block.service";
import { revalidatePath } from "next/cache";

export const onBlock = async (id: string) => {
  // TODO
  // Disconnect livestream
  // Allow to kick the guest
  const blockedUser = await blockUser(id);

  // Reset page cache
  revalidatePath("/");

  if (blockedUser) {
    revalidatePath(`/${blockedUser.blocked.username}`);
  }

  return blockedUser;
};

export const onUnBlock = async (id: string) => {
  const unBlockedUser = await unblockUser(id);

  // Reset page cache
  revalidatePath("/");

  if (unBlockedUser) {
    revalidatePath(`/${unBlockedUser.blocked.username}`);
  }

  return unBlockedUser;
};
