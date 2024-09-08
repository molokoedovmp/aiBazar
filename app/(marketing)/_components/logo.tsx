import Link from "next/link";
import { Poppins } from "next/font/google";
import Image from "next/image"; // Импортируем компонент для изображений
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <Link href="/" passHref>
      <div className="hidden md:flex items-center gap-x-2 cursor-pointer">
        {/* Используем изображение вместо BotIcon */}
        <Image
          src="/Logo2.png"
          alt="Логотип aiBazar"
          width={42} // Ширина логотипа
          height={42} // Высота логотипа
          className="dark:hidden"
        />
        <Image
          src="/Logo2.png"
          alt="Логотип aiBazar"
          width={42}
          height={42}
          className="hidden dark:block"
        />
        <p className={cn("font-semibold", font.className)}>
          aiBazar
        </p>
      </div>
    </Link>
  );
};
