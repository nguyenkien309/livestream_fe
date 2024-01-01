import { db } from "@/lib/db";

export const getUserByUserName = async (username: string) => {
  const user = db.user.findUnique({
    where: { username },
  });

  return user;
};
