"use client";

import { DollarSignIcon, BotIcon, VideoIcon, MusicIcon, ImageIcon, TextIcon,} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SubmitPage from "@/app/(marketing)/_components/submit";
import FeaturePage from "./FeatureSection";
import ContentPage from "./ContentSection";

export function Landingsecond() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(`/services${path}`);
  };
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative w-full h-screen overflow-hidden">
          <img
            src="/2.png" // Замените на путь к вашему изображению
            alt="Hero Image"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.4)] z-5" />
          <div className="relative z-10 container h-full flex flex-col items-center justify-center text-center text-primary-foreground space-y-6 px-4 md:px-6">
            <h1 className="text-white text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Мощь AI под вашим контролем
            </h1>
            <p className="text-white max-w-3xl text-lg md:text-xl">
              Здесь собрана большая библиотека из AI инструментов.
            </p>
            <Link
              href="/bazar"
              className="button-custom"
              prefetch={false}
            >
              Смотреть
            </Link>
          </div>
        </section>
        

        {/* Designer Services Section */}
        <section className="relative py-12 md:py-24 lg:py-32 bg-muted">
          <img
            src="/3.png" // Замените на путь к вашему изображению
            alt="Featured AI Products"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-10">
            <ContentPage />
          </div>
        </section>
        

        {/* Featured AI Products Section */}
        <section className="relative py-12 md:py-24 lg:py-32 bg-muted">
          <img
            src="/3.png" // Замените на путь к вашему изображению
            alt="Featured AI Products"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-white text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Наиболее популярные AI
                </h2>
                <p className="text-white max-w-3xl text-lg md:text-xl">
                  Откройте для себя новейшие и самые инновационные инструменты и сервисы искусственного интеллекта.
                </p>
              </div>
            </div>
            <FeaturePage /> 
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32">
          <img
            src="/3.png" // Замените на путь к вашему изображению
            alt="CTA Image"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-10 container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-white text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Предложи свой AI
              </h2>
              <p className="text-white max-w-3xl text-lg md:text-xl">
                Предложи новый полезный AI, которого у нас нет и он обязательно появится на нашем сайте.
              </p>
            </div>
            <SubmitPage />
          </div>
        </section>

      </main>
    </div>
  );
}
