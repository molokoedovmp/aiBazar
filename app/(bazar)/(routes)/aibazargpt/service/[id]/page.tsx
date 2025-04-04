"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ArrowLeft, Bot, X } from "lucide-react"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import { Spinner } from "@/components/spinner"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Интерфейс для инструмента AI
interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | string;
  rating: number;
  isActive: boolean;
  url: string;
  coverImage: string | null;
}

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const service = useQuery(api.aibazargpt.getById, { 
    id: params.id as Id<"aibazargpt"> 
  })
  const createPayment = useMutation(api.payments.create)
  
  // Состояния для демо-режима
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [aiTools, setAiTools] = useState<AITool[]>([])
  const [userQuery, setUserQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([
    {
      role: "assistant",
      content: "Привет! Я AI Поиск - ваш помощник в выборе AI-инструментов. Опишите, какой инструмент вы ищете или какую задачу хотите решить, и я порекомендую подходящие варианты из нашего каталога."
    }
  ])
  
  // Загружаем данные инструментов
  useEffect(() => {
    const loadAITools = async () => {
      try {
        const response = await fetch('/aibazargpt/ai-tools-export (1).json')
        const data = await response.json()
        setAiTools(data)
      } catch (error) {
        console.error("Ошибка при загрузке инструментов:", error)
      }
    }
    
    loadAITools()
  }, [])
  
  // Функция для отправки запроса к AI
  const handleSendQuery = async () => {
    if (!userQuery.trim()) return
    
    // Добавляем запрос пользователя в историю
    const newConversation = [
      ...conversation,
      { role: "user", content: userQuery }
    ]
    setConversation(newConversation)
    setIsLoading(true)
    
    try {
      // Имитация запроса к API (в реальном приложении здесь будет запрос к вашему API)
      const response = await generateAIResponse(userQuery, aiTools)
      
      // Добавляем ответ AI в историю
      setConversation([
        ...newConversation,
        { role: "assistant", content: response }
      ])
    } catch (error) {
      console.error("Ошибка при получении ответа:", error)
      toast.error("Не удалось получить рекомендации")
    } finally {
      setIsLoading(false)
      setUserQuery("")
    }
  }
  
  // Функция для генерации ответа AI (имитация)
  const generateAIResponse = async (query: string, tools: AITool[]): Promise<string> => {
    // Имитируем задержку запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Фильтруем инструменты на основе запроса
    const keywords = query.toLowerCase().split(' ')
    
    // Ищем совпадения в названии, описании и категории
    const matchedTools = tools
      .filter(tool => tool.isActive) // Только активные инструменты
      .filter(tool => {
        const nameMatch = keywords.some(keyword => 
          tool.name.toLowerCase().includes(keyword)
        )
        const descMatch = keywords.some(keyword => 
          tool.description.toLowerCase().includes(keyword)
        )
        const categoryMatch = keywords.some(keyword => 
          tool.category.toLowerCase().includes(keyword)
        )
        
        return nameMatch || descMatch || categoryMatch
      })
      .sort((a, b) => b.rating - a.rating) // Сортируем по рейтингу
      .slice(0, 3) // Берем топ-3
    
    if (matchedTools.length === 0) {
      return `
К сожалению, я не нашел инструментов, точно соответствующих вашему запросу "${query}". 

Попробуйте уточнить запрос или использовать другие ключевые слова. Вы можете искать по категориям (например, "видео", "дизайн", "код") или по конкретным задачам (например, "создание презентаций", "генерация изображений").
      `
    }
    
    // Формируем красивый ответ с рекомендациями
    let response = `По вашему запросу "${query}" я нашел следующие инструменты:\n\n`
    
    matchedTools.forEach((tool, index) => {
      response += `### ${index + 1}. ${tool.name}\n`
      response += `**Категория:** ${tool.category}\n`
      response += `**Рейтинг:** ${tool.rating}/10\n`
      response += `**Цена:** ${typeof tool.price === 'number' ? `${tool.price} ₽` : tool.price}\n\n`
      response += `${tool.description}\n\n`
    })
    
    response += `Хотите узнать больше о каком-то конкретном инструменте или уточнить запрос?`
    
    return response
  }

  if (!service || !service.details) {
    return (
      <div className="h-full flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  const handlePayment = async () => {
    try {
      if (service.price === "Бесплатно" || typeof service.price !== "number") {
        return;
      }

      const payment = await createPayment({
        serviceId: params.id as Id<"aibazargpt">,
        amount: service.price,
        status: "pending"
      })

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: service.price,
          description: service.title,
          paymentId: payment.id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment')
      }

      const data = await response.json()
      
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url
      } else {
        throw new Error('No confirmation URL received')
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error instanceof Error ? error.message : "Ошибка при создании платежа")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <Link href="/aibazargpt">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>

        {/* Обложка */}
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-8">
          <Image
            src={service.coverImage || service.icon || "/default.png"}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-muted-foreground text-lg mb-8">{service.description}</p>

            {/* Детальное описание */}
            <div className="space-y-8">
              {service.details.overview && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Обзор</h2>
                  <p className="text-muted-foreground">{service.details.overview}</p>
                </div>
              )}

              {/* Возможности */}
              {service.details.capabilities?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Возможности</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.details.capabilities.map((capability, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        {capability.icon && (
                          <div className="relative w-full aspect-[16/9]">
                            <Image
                              src={capability.icon}
                              alt={capability.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                          <p className="text-muted-foreground text-base">{capability.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Требования */}
              {service.details.requirements?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Требования</h2>
                  <ul className="space-y-2">
                    {service.details.requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Примеры использования */}
              {service.details.useCases?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Примеры использования</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {service.details.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Боковая панель */}
          <div>
            <Card className="p-6 sticky top-8">
              <div className="text-3xl font-bold mb-4">
                {service.price === "Бесплатно" ? "Бесплатно" : `${service.price} ₽`}
              </div>
              {service.status === "coming_soon" ? (
                <>
                  <Button 
                    disabled
                    className="w-full mb-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                  >
                    Скоро будет доступен
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Мы уведомим вас, когда сервис станет доступен
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handlePayment}
                    className="w-full mb-3"
                  >
                    Получить доступ
                  </Button>
                  <Button 
                    onClick={() => setIsDemoOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Попробовать демо
                  </Button>
                  <div className="text-sm text-muted-foreground mt-3">
                    Мгновенный доступ после оплаты
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Диалоговое окно демо-режима */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              AI Поиск - Демо режим
            </DialogTitle>
            <DialogDescription>
              Задайте вопрос, и я помогу подобрать подходящие AI-инструменты из нашего каталога
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] gap-3`}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg p-4 ${
                        message.role === 'assistant' 
                          ? 'bg-muted text-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ 
                        __html: message.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*?)\n/g, '<h3>$1</h3>')
                      }} />
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex flex-row max-w-[80%] gap-3">
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </Avatar>
                    <div className="rounded-lg p-4 bg-muted">
                      <Spinner size="sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex-shrink-0">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Опишите, какой инструмент вы ищете..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendQuery()
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendQuery} disabled={isLoading || !userQuery.trim()}>
                Отправить
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

