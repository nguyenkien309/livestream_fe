import { db } from "@/lib/db";
import { getCurrentUser } from "./auth.service";

export const isBlockedByUser = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === currentUser.id) {
      return false;
    }

    const existingBlock = await db.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: otherUser.id,
          blockedId: currentUser.id,
        },
      },
    });

    return !!existingBlock;
  } catch {
    return false;
  }
};

export const checkBlockUser = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    const otherUser = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!otherUser) throw new Error("User not found");

    if (otherUser.id === currentUser.id) {
      return false;
    }

    // findUnique() use index
    const existingBlock = await db.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: otherUser.id,
          blockedId: currentUser.id,
        },
      },
    });

    return !!existingBlock;
  } catch {
    return false;
  }
};

export const blockUser = async (currentUserId: string, id: string) => {
  // const self = await getCurrentUser();
  if (currentUserId === id) {
    throw new Error("Cannot block yourself");
  }

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) throw new Error("User not found");

  const existingBlock = await db.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: otherUser.id,
        blockedId: currentUserId,
      },
    },
  });

  if (existingBlock) throw new Error("User is already blocked");

  // const block = await db.block.create({
  //     data: {
  //         blocker: {
  //             connect: { id: self.id }
  //         },
  //         blocked: {
  //             connect: { id: otherUser.id }
  //         }
  //     }
  // })
  const block = await db.block.create({
    data: {
      blockerId: currentUserId,
      blockedId: otherUser.id,
    },
    include: {
      blocked: true,
    },
  });

  return block;
};

export const unblockUser = async (currentUserId: string, id: string) => {
  // const self = await getCurrentUser();

  if (currentUserId === id) {
    throw new Error("Cannot unblock yourself");
  }

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  const existingBlock = await db.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: currentUserId,
        blockedId: otherUser.id,
      },
    },
  });

  if (!existingBlock) {
    throw new Error("Not blocked");
  }

  const unBlock = await db.block.delete({
    where: {
      id: existingBlock.id,
    },
    include: {
      blocked: true,
    },
  });

  return unBlock;
};

export const getBlockedUsers = async () => {
  const currentUser = await getCurrentUser();

  const blockedUsers = await db.block.findMany({
    where: {
      blockerId: currentUser.id,
    },
    include: {
      blocked: true,
    },
  });

  return blockedUsers;
};
