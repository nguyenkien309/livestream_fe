"use server";

import { v4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";

import { getUserById } from "@/app/api/user.service";
import { getCurrentUser } from "@/app/api/auth.service";
import { isBlockedByUser } from "@/app/api/block.service";

export const createViewerToken = async (hostIdentity: string) => {
  let currentUser;

  try {
    currentUser = await getCurrentUser();
  } catch {
    const id = v4();
    const username = `Guest#${new Date().getTime()}`;
    currentUser = { id, username };
  }

  const host = await getUserById(hostIdentity);

  if (!host) {
    throw new Error("User not found");
  }

  const isBlocked = await isBlockedByUser(host.id);

  if (isBlocked) {
    throw new Error("User is blocked");
  }

  const isHost = currentUser.id === host.id;
  const identity = isHost ? `host-${currentUser.id}` : currentUser.id;

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity,
      name: currentUser.username,
    },
  );

  token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: false,
    canPublishData: true,
  });

  return await Promise.resolve(token.toJwt());
};
