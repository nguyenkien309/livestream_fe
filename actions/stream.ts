"use server";

import { getCurrentUser } from "@/app/api/auth.service";
import { db } from "@/lib/db";
import { Stream } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateStream = async (data: Partial<Stream>) => {
  try {
    const currentUser = await getCurrentUser();
    const stream = await db.stream.findFirst({
      where: { userId: currentUser.id },
    });

    if (!stream) throw new Error("Stream not found");

    const updateStream = await db.stream.update({
      where: { id: stream.id },
      data: {
        name: data.name,
        discordUrl: data.discordUrl,
        isChatEnabled: data.isChatEnabled,
        isChatDelayed: data.isChatDelayed,
        isChatFollowersOnly: data.isChatFollowersOnly,
      },
    });

    revalidatePath(`u/${currentUser.username}/chat`);
    // revalidatePath(`u/${self.username}`)
    // revalidatePath(`/${self.username}`)

    return updateStream;
  } catch {
    throw new Error("Error updating stream");
  }
};
