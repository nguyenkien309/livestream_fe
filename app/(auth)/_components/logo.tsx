import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <div>
        <Image src="/web.svg" alt="Gamehub" height="80" width="80" />
      </div>
      <div className={cn("flex flex-col items-center", font.className)}>
        <p className="text-xl font-semibold">Gamehub</p>
        <p className="text-sm text-muted-foreground ">Let's play</p>
      </div>
    </div>
  );
};
