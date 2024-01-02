"use server";

import { getSelf } from "@/app/api/auth.service";
import { db } from "@/lib/db";
import { Stream } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateStream = async (data: Partial<Stream>) => {
    try {
        const self = await getSelf();
        const stream = await db.stream.findFirst({
            where: { userId: self.id },
        });

        if (!stream) throw new Error("Stream not found");

        const updateStream = await db.stream.update({
            where: { id: stream.id },
            data: {
                name: data.name,
                isChatEnabled: data.isChatEnabled,
                isChatDelayed: data.isChatDelayed,
                isChatFollowersOnly: data.isChatFollowersOnly,
            },
        });

        revalidatePath(`u/${self.username}/chat`)
        // revalidatePath(`u/${self.username}`)
        // revalidatePath(`/${self.username}`)

        return updateStream
    } catch {
        throw new Error("Error updating stream");
    }
};
