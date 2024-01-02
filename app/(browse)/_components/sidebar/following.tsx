"use client";

import { useSidebar } from "@/store/sidebar";
import { Follow, User } from "@prisma/client";
import { UserItem } from "./user_item";
import { ToggleSkeleton } from "./toggle";

interface FollowingProps {
  data: (Follow & { following: User })[];
}

export const Following = ({ data }: FollowingProps) => {
  const { collapsed } = useSidebar((state) => state);

  if (!data.length) {
    return null;
  }

  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((follow) => (
          <UserItem
            key={follow.following.id}
            userName={follow.following.username}
            imageUrl={follow.following.imageUrl}
            category="test"
            // isLive={true}
          />
        ))}
      </ul>
    </div>
  );
};
