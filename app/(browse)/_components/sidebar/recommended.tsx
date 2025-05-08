"use client";

import { useSidebar } from "@/store/sidebar";
import { User } from "@prisma/client";
import { UserItem } from "./user_item";

interface RecommendedProps {
  data: (User & {
    stream: { isLive: boolean } | null;
  })[];
}

export const Recommended = ({ data }: RecommendedProps) => {
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);
  const showLable = !collapsed && data.length > 0;

  return (
    <div>
      {showLable && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Recommended</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            userName={user.username}
            imageUrl={user.imageUrl}
            isLive={user?.stream?.isLive}
          />
        ))}
      </ul>
    </div>
  );
};
