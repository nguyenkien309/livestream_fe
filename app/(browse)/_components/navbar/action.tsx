import Link from "next/link";
import { Clapperboard, User } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  currentUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const Actions = async () => {
  const user = await currentUser();

  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0 font-semibold">
      {!user && (
        <div className="flex flex-row">
          <div className="mr-2.5">
            <SignInButton>
              <Button size="sm" variant="customLogin">
                Log In
              </Button>
            </SignInButton>
          </div>
          <div className="mr-2">
            <SignUpButton>
              <Button size="sm" variant="customSignUp">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
          <div className="flex items-center justify-center">
            <User />
          </div>
        </div>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${user.username}`}>
              <Clapperboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Creator Dashboard</span>
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
};
