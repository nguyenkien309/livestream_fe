"use client";

import { VerifiedMark } from "../verified_mark";
import { BioModal } from "./bio_modal";
import {
  SearchIcon,
  Link as LucidIconLink,
  Twitch,
  Twitter,
  MessageSquareQuote,
} from "lucide-react";
import Link from "next/link";

interface AboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  bio: string | null;
  followedByCount: number;
  discordUrl?: string | null;
}

export const AboutCard = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  bio,
  followedByCount,
  discordUrl,
}: AboutCardProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  const followedByLabel = followedByCount === 1 ? "follower" : "followers";

  return (
    <div className="px-4">
      <div className="group rounded-xl bg-background p-6 lg:p-10 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl">
            {hostName}
            <VerifiedMark />
          </div>
          {isHost && <BioModal initialValue={bio} />}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">{followedByCount}</span>{" "}
          {followedByLabel}
        </div>
        <p className="text-sm">
          {bio || "This user prefers to keep an air of mystery about them."}
        </p>

        <div className="flex items-center justify-center gap-x-2 border-top text-muted-foreground">
          {discordUrl && (
            <Link
              href={``}
              className=" flex item-center justify-center align-middle "
            >
              <MessageSquareQuote className="h-6 w-5 font-bold" />
              <span className="font-xl ml-1 font-bold">Discord</span>
            </Link>
          )}

          <Link
            href={``}
            className=" flex item-center justify-center align-middle "
          >
            <Twitch className="h-6 w-5 text-muted-foreground" />
            <span className="font-xl ml-1 font-bold">Twitch</span>
          </Link>

          <Link
            href={``}
            className=" flex item-center justify-center align-middle "
          >
            <Twitter className="h-6 w-5 text-muted-foreground " />
            <span className="font-xl ml-1 font-bold">Tweet</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
