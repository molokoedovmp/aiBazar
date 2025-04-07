"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Presentation, Search, Zap, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"

// Определяем константный массив сервисов
const services = [
  {
    id: "ai-search",
    title: "AI Поиск",
    icon: Search,
    description: "Подбор нейросетей для ваших задач",
    link: "/bazarius/ai-search",
    imageUrl: "/aibazargpt/aisearch.png"
  },
  {
    id: "ai-presentation",
    title: "GPT для презентаций",
    icon: Presentation,
    description: "Автоматическое создание презентаций с помощью AI",
    link: "/bazarius/ai-presentation",
    imageUrl: "/aibazargpt/aipres.png"
  },
  {
    id: "ai-blog",
    title: "GPT для статей",
    icon: Presentation,
    description: "Автоматическое создание статей для блога с помощью AI",
    link: "/bazarius/ai-blog",
    imageUrl: "/aibazargpt/aiblog.png"
  }
]

// Константа для гостевого лимита
const GUEST_REQUEST_LIMIT = 3

export default function AccountPage() {
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  
  // Запрос к Convex для получения информации о лимитах пользователя
  const userCredits = useQuery(
    api.userCredits.getUserCredits, 
    isSignedIn ? { userId: user?.id } : "skip"
  )
  
  // Для неавторизованных пользователей используем localStorage
  const [guestRequestCount, setGuestRequestCount] = useState(0)
  
  // Загружаем счетчик гостевых запросов из localStorage при инициализации
  useEffect(() => {
    if (!isSignedIn) {
      const storedCount = localStorage.getItem("guest-bazarius-requests")
      if (storedCount) {
        setGuestRequestCount(parseInt(storedCount, 10))
      }
    }
  }, [isSignedIn])
  
  // Определяем лимиты в зависимости от статуса пользователя
  const requestsRemaining = isSignedIn 
    ? (userCredits?.remainingCredits || 0) 
    : (GUEST_REQUEST_LIMIT - guestRequestCount)
  
  const requestLimit = isSignedIn 
    ? (userCredits?.totalCredits || 10) 
    : GUEST_REQUEST_LIMIT

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
          {isSignedIn 
            ? `У вас осталось ${requestsRemaining} из ${requestLimit} кредитов.`
            : `Гостевой режим: ${requestsRemaining} из ${GUEST_REQUEST_LIMIT} запросов.`}
        </p>
      </div>

      {/* Карточки сервисов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          return (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>{service.title}</CardTitle>
                  <Badge variant={requestsRemaining > 0 ? "default" : "destructive"}>
                    {requestsRemaining > 0 ? 
                      `${requestsRemaining}/${requestLimit}` : 
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
                      <span className="text-muted-foreground">Доступно:</span>
                      <span>{requestsRemaining} / {requestLimit}</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 bg-secondary rounded-full">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, ((requestLimit - requestsRemaining) / requestLimit) * 100)}%` }}
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

      <div className="mt-8 text-center">
        <div className="mb-4 text-muted-foreground">
          {isSignedIn 
            ? `У вас осталось ${requestsRemaining} из ${requestLimit} кредитов.`
            : `Гостевой режим: ${requestsRemaining} из ${GUEST_REQUEST_LIMIT} запросов.`}
        </div>
        <Button 
          onClick={() => router.push('/bazarius/pricing')} 
          className="gap-2"
          variant="default"
          size="lg"
        >
          <Zap className="h-4 w-4 fill-current text-yellow-500" />
          Пополнить кредиты
        </Button>
      </div>

    </div>
  )
}
