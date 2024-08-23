import Link from "next/link";
import { Poppins } from "next/font/google";
import { BotIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <Link href="/" passHref>
      <div className="hidden md:flex items-center gap-x-2 cursor-pointer">
        {/* Иконка BotIcon вместо изображения логотипа */}
        <BotIcon className="h-8 w-8 dark:hidden" />
        <BotIcon className="h-8 w-8 hidden dark:block" />
        <p className={cn("font-semibold", font.className)}>
          aiBazar
        </p>
      </div>
    </Link>
  );
};

