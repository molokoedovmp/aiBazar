"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function MenuBar() {
  const router = useRouter();
  const categories = useQuery(api.categories.get); // Получаем категории

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex">
        <nav className="bg-muted/40 border-r p-6 hidden lg:block">
          <div className="flex flex-col gap-4">
            {categories?.map((category, index) => (
              <div key={category._id}>
                <Button
                  onClick={() => router.push(`/category/${category._id}`)} // Перенаправление при клике
                  variant="ghost" // Применение стилей кнопки
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  {category.name}
                </Button>
                {/* Добавляем сепаратор между кнопками, кроме последней */}
                {index < categories.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
