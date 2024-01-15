"use server";

import { getCurrentUser } from "@/app/api/auth.service";
import { blockUser, unblockUser } from "@/app/api/block.service";
import { RoomServiceClient } from "livekit-server-sdk";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

export const onBlock = async (id: string) => {
  const currentUser = await getCurrentUser();

  let blockedUser;

  try {
    blockedUser = await blockUser(currentUser.id, id);
  } catch {
    // User is a guest
  }

  try {
    await roomService.removeParticipant(currentUser.id, id);
  } catch {
    // User is not in the room
  }

  revalidatePath(`/u/${currentUser.username}/community`);

  return blockedUser;
};

export const onUnblock = async (id: string) => {
  const currentUser = await getCurrentUser();
  const unblockedUser = await unblockUser(currentUser.id, id);

  revalidatePath(`/u/${currentUser.username}/community`);
  return unblockedUser;
};
