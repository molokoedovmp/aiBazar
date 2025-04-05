"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/spinner"
import { ArrowLeft, Bot, Search, Star, ShoppingCart, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PaymentDialog } from "@/components/payment-dialog"
import { useAuth } from "@clerk/clerk-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Импорт изображения для аватара
import assistantAvatar from '@/public/error-dark.png'

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

// Интерфейс для сообщения в чате
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AISearchPage() {
  const router = useRouter()
  const createPayment = useMutation(api.payments.create)
  const { userId } = useAuth()
  const storageKey = `ai-search-requests-${userId || 'anonymous'}`
  const [requestsCount, setRequestsCount] = useLocalStorage<number>(storageKey, 0)
  const maxFreeRequests = 10
  
  // Состояния
  const [aiTools, setAiTools] = useState<AITool[]>([])
  const [userQuery, setUserQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "assistant",
      content: "Привет! Я AI Поиск - ваш помощник в выборе AI-инструментов. Опишите, какой инструмент вы ищете или какую задачу хотите решить, и я порекомендую подходящие варианты из нашего каталога."
    }
  ])
  const [recommendedTools, setRecommendedTools] = useState<AITool[]>([])
  
  // Состояние для AlertDialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null)
  
  // Загружаем данные инструментов из JSON-файла
  useEffect(() => {
    const loadAITools = async () => {
      try {
        const response = await fetch('/aibazargpt/ai-tools-export (1).json')
        const data = await response.json()
        setAiTools(data)
      } catch (error) {
        console.error("Ошибка при загрузке инструментов:", error)
        toast.error("Не удалось загрузить каталог инструментов")
      }
    }
    
    loadAITools()
  }, [])
  
  // Функция для отправки запроса к OpenAI API
  const handleSendQuery = async () => {
    if (!userQuery.trim()) return
    
    // Проверяем количество запросов
    if (requestsCount >= maxFreeRequests) {
      toast.error("Вы достигли лимита бесплатных запросов. Приобретите подписку для продолжения.")
      return
    }
    
    // Добавляем запрос пользователя в историю
    const newConversation = [
      ...conversation,
      { role: "user", content: userQuery } as Message
    ]
    setConversation(newConversation)
    setIsLoading(true)
    
    try {
      // Отправляем запрос к API (реальный эндпоинт)
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          tools: aiTools,
          conversation: newConversation
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Увеличиваем счетчик запросов
      setRequestsCount(prev => prev + 1)
      
      // Добавляем ответ AI в историю
      setConversation([
        ...newConversation,
        { role: "assistant", content: data.response } as Message
      ])
      
      // Обновляем рекомендованные инструменты на основе ID
      if (data.recommendedTools && data.recommendedTools.length > 0) {
        const toolsToShow = data.recommendedTools.map((toolId: string) => 
          aiTools.find(tool => tool.id === toolId)
        ).filter(Boolean)
        
        setRecommendedTools(toolsToShow)
      }
    } catch (error) {
      console.error("Ошибка при получении ответа:", error)
      toast.error("Не удалось получить рекомендации")
      setConversation([
        ...newConversation,
        { 
          role: "assistant", 
          content: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз или уточните ваш запрос." 
        } as Message
      ])
    } finally {
      setIsLoading(false)
      setUserQuery("")
    }
  }
  
  // Функция для обработки клика по инструменту
  const handleToolClick = (tool: AITool) => {
    setSelectedTool(tool)
    setIsDialogOpen(true)
  }
  
  // Функция для обработки оплаты
  const handlePayment = async (tool: AITool) => {
    try {
      if (typeof tool.price !== 'number') return;
      router.push(`/aibazargpt/service/${tool.id}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Не удалось перейти к странице оплаты");
    }
  }
  
  // Функция для форматирования цены
  const formatPrice = (price: number | string) => {
    return typeof price === 'number' ? `${price} ₽` : price;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка */}
        <div className="mb-8">
          <Link href="/bazarius">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Search className="h-8 w-8 mr-3 text-primary" />
                AI Поиск
              </h1>
              <p className="text-muted-foreground mt-2">
                Умный поиск нейросетей по запросу и подбор оптимального решения для ваших задач
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-yellow-500 border-yellow-500">
              Beta-версия
            </Badge>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Чат с AI */}
          <Card className="lg:col-span-2 flex flex-col h-[70vh]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                Чат с AI Поиском
              </CardTitle>
              <CardDescription>
                Опишите, какой инструмент вы ищете или какую задачу хотите решить
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-4 bg-muted/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${requestsCount >= maxFreeRequests ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium">
                    Осталось запросов: {Math.max(0, maxFreeRequests - requestsCount)} из {maxFreeRequests}
                  </span>
                </div>
                {requestsCount >= maxFreeRequests && (
                  <Button size="sm" variant="outline" onClick={() => router.push('/pricing')}>
                    Купить подписку
                  </Button>
                )}
              </div>
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] gap-3`}>
                        {message.role === 'assistant' && (
                          <Avatar className="relative h-10 w-10 rounded-full overflow-hidden bg-transparent">
                            <Image
                              src={assistantAvatar}
                              alt="Assistant Avatar"
                              fill
                              className="object-cover"
                            />
                          </Avatar>                       
                        )}
                        <div 
                          className={`rounded-lg p-4 ${message.role === 'assistant' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'}`}
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
                          <Image 
                            src={assistantAvatar} 
                            alt="Assistant Avatar" 
                            width={32} 
                            height={32} 
                            className="rounded-full" 
                          />
                        </Avatar>
                        <div className="rounded-lg p-4 bg-muted">
                          <Spinner size="sm" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4">
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
            </CardFooter>
          </Card>
          
          {/* Рекомендованные инструменты */}
          <Card className="h-[70vh] flex flex-col">
            <CardHeader>
              <CardTitle>Рекомендованные инструменты</CardTitle>
              <CardDescription>
                Инструменты, подобранные на основе вашего запроса
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-4 bg-muted/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${requestsCount >= maxFreeRequests ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium">
                    Осталось запросов: {Math.max(0, maxFreeRequests - requestsCount)} из {maxFreeRequests}
                  </span>
                </div>
                {requestsCount >= maxFreeRequests && (
                  <Button size="sm" variant="outline" onClick={() => router.push('/pricing')}>
                    Купить подписку
                  </Button>
                )}
              </div>
              <ScrollArea className="h-full pr-4">
                {recommendedTools.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedTools.map((tool) => (
                      <Card 
                        key={tool.id} 
                        className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleToolClick(tool)}
                      >
                        {tool.coverImage && (
                          <div className="relative w-full h-32">
                            <Image src={tool.coverImage} alt={tool.name} fill className="object-cover" />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{tool.name}</h3>
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 text-sm">{tool.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {tool.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{tool.category}</Badge>
                            <span className="font-medium">
                              {formatPrice(tool.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">
                      Задайте вопрос, чтобы получить рекомендации по AI-инструментам
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Информация о сервисе */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Как это работает</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI Поиск анализирует ваш запрос и предлагает оптимальные решения из нашего каталога AI-инструментов. 
                Система учитывает ваши потребности, бюджет и специфику задачи для подбора наиболее подходящих вариантов.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Преимущества</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Экономия времени на поиск подходящих инструментов</li>
                <li>• Персонализированные рекомендации под ваши задачи</li>
                <li>• Доступ к проверенным AI-решениям</li>
                <li>• Актуальная информация о ценах и возможностях</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Для кого</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Предприниматели и стартапы</li>
                <li>• Маркетологи и контент-менеджеры</li>
                <li>• Дизайнеры и разработчики</li>
                <li>• Все, кто хочет найти оптимальные AI-инструменты</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* AlertDialog для отображения деталей инструмента */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          {selectedTool && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">{selectedTool.name}</AlertDialogTitle>
                <AlertDialogDescription className="text-base text-foreground/80">
                  {selectedTool.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="my-4">
                {selectedTool.coverImage && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                    <Image src={selectedTool.coverImage} alt={selectedTool.name} fill className="object-cover" />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">Категория</h4>
                    <p>{selectedTool.category}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">Рейтинг</h4>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
                      <span>{selectedTool.rating}/10</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Цена</h4>
                  <p className="text-lg font-semibold">{formatPrice(selectedTool.price)}</p>
                </div>
              </div>
              
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                {typeof selectedTool.price === 'number' && selectedTool.price > 0 ? (
                  <>
                    <PaymentDialog price={selectedTool.price} title="aitools" tool={selectedTool}>
                      <Button className="w-full sm:w-auto">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Купить
                      </Button>
                    </PaymentDialog>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open(selectedTool.url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Смотреть
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open(selectedTool.url, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Смотреть
                  </Button>
                )}
                <AlertDialogCancel className="w-full sm:w-auto mt-2 sm:mt-0">
                  Закрыть
                </AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
