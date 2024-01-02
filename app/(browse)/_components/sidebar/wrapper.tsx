"use client";

import { useIsClient } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/sidebar";
import { ToggleSkeleton } from "./toggle";
import { RecommendedSkeleton } from "./skeletons";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  // Check client or server component
  const isClient = useIsClient();
  const { collapsed } = useSidebar((state) => state);

  if (!isClient) {
    return (
      <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
        <ToggleSkeleton />
        <RecommendedSkeleton />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50",
        collapsed && "w-[70px]",
      )}
    >
      {children}
    </aside>
  );
};
