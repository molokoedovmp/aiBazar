"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Search, PresentationIcon, Zap, Clock, Lightbulb, Award, Users, Sparkles, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AiBazarGPTPage() {
  // Расширенные описания сервисов с дополнительными характеристиками
  const services = [
    {
      key: "ai-search",
      title: "AI Поиск",
      tagline: "Интеллектуальный подбор нейросетей для ваших задач",
      description:
        "Наш умный поисковый сервис анализирует ваши потребности и подбирает оптимальные AI-инструменты среди сотен доступных решений. Благодаря продвинутым алгоритмам и обширной базе данных, мы предлагаем точные рекомендации, учитывающие специфику вашей отрасли, бюджет и технические требования.",
      longDescription: "AI Поиск использует собственную нейросеть для анализа вашего запроса и сопоставления его с обширной базой данных инструментов искусственного интеллекта. Сервис учитывает множество параметров: функциональность, стоимость, сложность использования, совместимость с вашими системами и отзывы пользователей. Результат — персонализированный список решений, идеально соответствующих вашим потребностям.",
      features: [
        { icon: Zap, text: "Мгновенный подбор решений из базы 500+ AI-инструментов" },
        { icon: Clock, text: "Экономия до 70% времени на поиске подходящих инструментов" },
        { icon: PresentationIcon, text: "Фильтрация по отрасли, бюджету и техническим требованиям" }
      ],
      image: "/aibazargpt/aisearch.png",
      link: "/bazarius/ai-search"
    },
    {
      key: "ai-presentation",
      title: "GPT для презентаций",
      tagline: "Превращаем ваши идеи в профессиональные презентации",
      description:
        "Революционный сервис автоматизированного создания презентаций на базе искусственного интеллекта. Просто опишите ваши идеи, и наш GPT превратит их в стильные, структурированные слайды с оптимальным сочетанием текста, графики и визуальных элементов.",
      longDescription: "GPT для презентаций — это передовая система генерации контента, которая понимает контекст вашей темы и создает убедительные презентации, соответствующие отраслевым стандартам. Наш искусственный интеллект не просто размещает текст на слайдах, но разрабатывает полноценную историю с логической структурой, подбирает релевантные данные и визуализирует их в профессиональном формате.",
      features: [
        { icon: Lightbulb, text: "Генерация полноценных презентаций из текстового описания" },
        { icon: Award, text: "Профессиональные шаблоны для различных отраслей и целей" },
        { icon: Users, text: "Адаптация под аудиторию и цели вашего выступления" }
      ],
      image: "/aibazargpt/aipres.png",
      link: "/bazarius/ai-presentation"
    },
    {
      key: "ai-blog",
      title: "GPT для статей",
      tagline: "Превращаем ваши идеи в профессиональные статьи",
      description:
        "Революционный сервис автоматизированного создания статей на базе искусственного интеллекта. Просто опишите ваши идеи, и наш GPT превратит их в качественный, структурированный текст, готовый для публикации.",
      longDescription: "GPT для статей — это передовая система генерации контента, которая понимает контекст вашей темы и создает уникальные тексты, соответствующие вашим требованиям. Наш искусственный интеллект генерирует статьи, учитывая стиль, тональность и длину, что позволяет получить материал, готовый для публикации с минимальными доработками.",
      features: [
        { icon: Lightbulb, text: "Генерация уникальных статей по текстовому описанию" },
        { icon: Award, text: "Высокое качество контента для блога" },
        { icon: Users, text: "Адаптация стиля под целевую аудиторию" }
      ],
      image: "/aibazargpt/aiblog.png",
      link: "/bazarius/ai-blog"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero секция */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-full mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Bazarius AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Центр передовых AI-решений для повышения вашей эффективности и креативности. Наши интеллектуальные сервисы созданы, чтобы вывести вашу работу на новый уровень.
          </p>

          {/* Карточки сервисов в одной строке (3 в ряду) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {services.map((service) => (
              <Link key={service.key} href={service.link}>
                <Card className="hover:shadow-lg transition-shadow h-full group">
                  <CardContent className="p-6">
                    <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      <span className="font-medium">Использовать сервис</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Секция сервисов с подробным описанием */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Наши инновационные сервисы
        </h2>
        
        <div className="space-y-24">
          {services.map((service, index) => (
            <div 
              key={service.key} 
              className={cn(
                "flex flex-col md:flex-row gap-12 items-center",
                index % 2 !== 0 && "md:flex-row-reverse"
              )}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-2">
                  {service.tagline}
                </div>
                <h3 className="text-3xl font-bold">{service.title}</h3>
                <p className="text-xl text-muted-foreground">
                  {service.description}
                </p>
                <p className="text-muted-foreground">
                  {service.longDescription}
                </p>
                <div className="space-y-4 mt-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p>{feature.text}</p>
                    </div>
                  ))}
                </div>
                <Link href={service.link}>
                  <Button className="mt-6 gap-2" size="lg">
                    Изучить {service.title} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <Card className="overflow-hidden shadow-2xl border-0">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      {service.key === "ai-search" ? (
                        <Search className="h-24 w-24 text-primary opacity-70" />
                      ) : service.key === "ai-presentation" ? (
                        <PresentationIcon className="h-24 w-24 text-primary opacity-70" />
                      ) : (
                        <Pencil className="h-24 w-24 text-primary opacity-70" />
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Секция призыва к действию */}
      <div className="container mx-auto px-4 py-24 mt-12">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Готовы повысить свою эффективность с AI?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Наши интеллектуальные сервисы созданы для решения ваших задач, экономии времени и достижения выдающихся результатов.
          </p>
          <Button size="lg" className="gap-2">
            Начать прямо сейчас <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
