"use client";

import {
  DollarSignIcon,
  BotIcon,
  VideoIcon,
  MusicIcon,
  ImageIcon,
  TextIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContentPage() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(`/services${path}`);
  };

  return (
    <section>
      <div className="container max-w-5xl px-4 md:px-6">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-center">
            Наши Услуги
          </h2>
          <p className="max-w-3xl text-lg md:text-xl text-center mx-auto">
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
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Оплата подписок
              </h3>
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
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Создание чат-бота
              </h3>
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
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Создание видео для соцсетей
              </h3>
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
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Создание и генерация музыки
              </h3>
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
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Обработка изображений
              </h3>
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
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Обработка текста и создание контента
              </h3>
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
