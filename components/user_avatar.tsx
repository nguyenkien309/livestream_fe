import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LiveBadge } from "./live_badge";

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  userName: string;
  imageUrl: string;
  isLive?: boolean;
  showBadge?: boolean;
}

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {
  showBadge?: boolean;
}

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
      // Add more sizes
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const UserAvatar = ({
  userName,
  imageUrl,
  isLive,
  showBadge,
  size,
}: UserAvatarProps) => {
  const isShowBadge = showBadge && isLive;

  return (
    <div className="relative">
      <Avatar
        className={cn(
          isLive && "ring-2 ring-rose-500 border border-background",
          avatarSizes({ size }),
        )}
      >
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          {userName[0]} {userName[userName.length - 1]}
        </AvatarFallback>
      </Avatar>
      {isShowBadge && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
};
