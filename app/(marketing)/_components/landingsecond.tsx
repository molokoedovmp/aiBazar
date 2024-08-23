import Link from "next/link";
import SubmitPage from "@/app/(marketing)/_components/submit";
import FeaturePage from "./FeatureSection";
import ContentPage from "./ContentSection";

export function Landingsecond() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative w-full h-screen overflow-hidden">
          {/* Заменяем Spline на изображение */}
          <img
            src="/3.png" // Замените на URL вашего изображения
            alt="Background Image"
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
        <div >
          <ContentPage />
        </div>

        {/* Featured AI Products Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Наиболее популярные AI
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Откройте для себя новейшие и самые инновационные инструменты и сервисы искусственного интеллекта.
                </p>
              </div>
            </div>
            <FeaturePage /> 
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Предложи свой AI
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
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
