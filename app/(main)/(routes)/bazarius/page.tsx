"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Presentation, Search, Zap, ArrowRight, Sparkles } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useAuth } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"

// Определяем константный массив сервисов
const services = [
  {
    id: "ai-search",
    title: "AI Поиск",
    icon: Search,
    description: "Подбор нейросетей для ваших задач",
    link: "/bazarius/ai-search",
    storageKey: "ai-search-requests",
    imageUrl: "/aibazargpt/aisearch.png"
  },
  {
    id: "ai-presentation",
    title: "GPT для презентаций",
    icon: Presentation,
    description: "Автоматическое создание презентаций с помощью AI",
    link: "/bazarius/ai-presentation",
    storageKey: "ai-presentation-requests",
    imageUrl: "/aibazargpt/aipres.png"
  },
  {
    id: "ai-blog",
    title: "GPT для статей",
    icon: Presentation, // можно заменить на другой, например, BlogIcon, если он есть
    description: "Автоматическое создание статей для блога с помощью AI",
    link: "/bazarius/ai-blog",
    storageKey: "ai-blog-requests",
    imageUrl: "/aibazargpt/aiblog.png"
  }
]

/**
 * Пользовательский хук для получения использования сервиса.
 * Принимает storageKey и максимальное количество бесплатных запросов.
 */
function useServiceUsage(storageKey: string, maxFreeRequests: number) {
  const { userId } = useAuth()
  const key = `${storageKey}-${userId || 'anonymous'}`
  const [requests] = useLocalStorage<number>(key, 0)
  return {
    used: requests,
    remaining: Math.max(0, maxFreeRequests - requests)
  }
}

export default function AccountPage() {
  const router = useRouter()
  const maxFreeRequests = 10

  // Вызываем пользовательский хук для каждого сервиса
  const usageAiSearch = useServiceUsage("ai-search-requests", maxFreeRequests)
  const usageAiPresentation = useServiceUsage("ai-presentation-requests", maxFreeRequests)
  const usageAiBlog = useServiceUsage("ai-blog-requests", maxFreeRequests)

  // Создадим объект для сопоставления id сервиса с данными использования
  const usageMap: { [key: string]: { used: number; remaining: number } } = {
    "ai-search": usageAiSearch,
    "ai-presentation": usageAiPresentation,
    "ai-blog": usageAiBlog
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Блок с описанием */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <span className="font-medium">Ваши AI инструменты</span>
        </div>
        <h2 className="text-3xl font-bold mb-3">Мои сервисы</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Управляйте доступными AI-сервисами и отслеживайте использование. 
          Каждый сервис включает {maxFreeRequests} бесплатных запросов в месяц.
        </p>
      </div>

      {/* Карточки сервисов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const usage = usageMap[service.id]
          
          return (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>{service.title}</CardTitle>
                  <Badge variant={usage.remaining > 0 ? "default" : "destructive"}>
                    {usage.remaining > 0 ? 
                      `${usage.remaining}/${maxFreeRequests}` : 
                      "Лимит исчерпан"}
                  </Badge>
                </div>
                
                {/* Область с изображением */}
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 bg-background/80 px-3 py-1 rounded-full text-sm">
                    <service.icon className="h-4 w-4 inline-block mr-2" />
                    {service.title}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="space-y-4">
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Использовано:</span>
                      <span>{usage.used} / {maxFreeRequests}</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 bg-secondary rounded-full">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(usage.used / maxFreeRequests) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => router.push(service.link)}
                    className="w-full gap-2"
                    variant="secondary"
                  >
                    Открыть сервис
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Bazarius AI. Все права защищены.
          </p>
          <Link href="bazarius/pricing">
            <Button variant="outline" className="gap-2">
              Премиум подписка
              <Zap className="h-4 w-4 fill-current text-yellow-500" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
