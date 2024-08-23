"use client";

import { DollarSignIcon, BotIcon, VideoIcon, MusicIcon, ImageIcon, TextIcon,} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContentPage() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(`/services${path}`);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container max-w-5xl px-4 md:px-6">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Наши Услуги</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Ознакомьтесь с нашим ассортиментом услуг, которые помогут вам улучшить бизнес и онлайн-присутствие.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className="rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick("/")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 text-primary-foreground">
                <DollarSignIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Оплата подписок</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Выберите нужный вам инструмент, посмотрите примеры его работы в нашем сообществе, и мы поможем оплатить подписку.
            </p>
          </div>

          <div
            className="rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick("/")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 text-primary-foreground">
                <BotIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Создание чат-бота</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Создание чат-ботов для обработки клиентов, контроля работы колл-центра или как автоответчик в соцсетях.
            </p>
          </div>

          <div
            className="rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick("/")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 text-primary-foreground">
                <VideoIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Создание видео для соцсетей</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Создание и монтаж видео для социальных сетей, включая перевод, сценарии и нарезки.
            </p>
          </div>

          <div
            className="rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick("/")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 text-primary-foreground">
                <MusicIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Создание и генерация музыки</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Генерация оригинальных музыкальных треков, создание фоновой музыки и автоматическое написание мелодий.
            </p>
          </div>

          <div
            className="rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick("/")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 text-primary-foreground">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Обработка изображений</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Автоматическая ретушь фотографий, распознавание объектов и создание фильтров и эффектов.
            </p>
          </div>

          <div
            className="rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick("/")}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 text-primary-foreground">
                <TextIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Обработка текста и создание контента</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Генерация текстов, анализ тональности и автоматическое резюмирование.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
