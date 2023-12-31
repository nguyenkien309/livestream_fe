"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import { usePathname } from "next/navigation";
import { UserAvatar } from "@/components/user_avatar";
import { LiveBadge } from "@/components/live_badge";

interface UserItemProps {
  userName: string;
  imageUrl: string;
  isLive?: boolean;
}

export const UserItem = ({ userName, imageUrl, isLive }: UserItemProps) => {
  const pathName = usePathname();
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);
  const href = `/${userName}`;
  const isActive = pathName === href;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-12",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent"
      )}
      asChild
    >
      <Link href={href}>
        <div
          className={cn(
            "flex items-center w-full gap-x-4",
            collapsed && "justify-center"
          )}
        >
          <UserAvatar
            imageUrl={imageUrl}
            userName={userName}
            isLive={isLive}
            showBadge={collapsed}
          />
          {!collapsed && (
            <div className="w-[110px]">
              <p className="truncate font-semibold">{userName}</p>
              {isLive && (
                <p className="truncate text-[11px] text-muted-foreground">
                  Category
                </p>
              )}
            </div>
          )}
          {!collapsed && isLive && <LiveBadge className="ml-auto" />}
        </div>
      </Link>
    </Button>
  );
};

export const UserItemSkeleton = () => {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-6" />
      </div>
    </li>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
};
