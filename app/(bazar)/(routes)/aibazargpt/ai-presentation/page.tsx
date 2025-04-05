"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Copy, FileCode, CheckCircle, Power, ScreenShare } from "lucide-react"
import { toast } from "sonner"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useAuth } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"

const parseVbaCode = (code: string) => {
  try {
    const slides: Array<{ title: string; content: string; images: number }> = []
    const slideRegex = /ActivePresentation\.Slides\.Add\(([\s\S]*?)\)/g
    const titleRegex = /\.TextFrame\.TextRange\.Text\s*=\s*"(.*?)"/
    
    let match
    while ((match = slideRegex.exec(code)) !== null) {
      const slideContent = match[0]
      const titleMatch = titleRegex.exec(slideContent)
      slides.push({
        title: titleMatch ? titleMatch[1] : 'Без названия',
        content: "",
        images: (slideContent.match(/\.AddPicture/g) || []).length
      })
    }
    
    return {
      success: true,
      totalSlides: slides.length,
      slides
    }
  } catch (error) {
    return {
      success: false,
      error: 'Не удалось распознать структуру презентации'
    }
  }
}

const SlidePreview = ({ slide, index }: { slide: any, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
        {index + 1}
      </div>
      <h3 className="font-semibold">{slide.title}</h3>
    </div>
    {slide.content && (
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {slide.content.length > 100 ? slide.content.slice(0, 100) + '...' : slide.content}
      </p>
    )}
    {slide.images > 0 && (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <FileCode className="h-4 w-4" />
        {slide.images} {slide.images === 1 ? 'изображение' : 'изображения'}
      </div>
    )}
  </motion.div>
)

export default function AiPresentationPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  
  const storageKey = `ai-presentation-requests-${userId || 'anonymous'}`
  const [requestsCount, setRequestsCount] = useLocalStorage<number>(storageKey, 0)
  const maxFreeRequests = 10

  const presentationStructure = useMemo(() => 
    result ? parseVbaCode(result) : null, 
  [result])

  const handleSubmit = async () => {
    if (!query.trim()) return
    
    if (requestsCount >= maxFreeRequests) {
      toast.error("Вы достигли лимита бесплатных запросов. Приобретите подписку для продолжения.")
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })
      
      if (!response.ok) throw new Error(`Ошибка API: ${response.status}`)
      
      const data = await response.json()
      setResult(data.response)
      setActiveTab('code')
      setRequestsCount(prev => prev + 1)
      toast.success("VBA-код успешно сгенерирован!")
    } catch (error) {
      console.error("Ошибка:", error)
      toast.error("Ошибка генерации кода")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success("Код скопирован!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/aibazargpt">
            <Button variant="ghost" className="mb-4 pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к каталогу
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <ScreenShare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Генератор презентаций</h1>
              <p className="text-muted-foreground mt-1">
                Создавайте VBA-код для PowerPoint через текстовый запрос
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Power className="h-5 w-5 text-primary" />
                  Запрос
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${requestsCount >= maxFreeRequests ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm font-medium">
                      Осталось: {Math.max(0, maxFreeRequests - requestsCount)}/{maxFreeRequests}
                    </span>
                  </div>
                  {requestsCount >= maxFreeRequests && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push('/pricing')}
                    >
                      Купить подписку
                    </Button>
                  )}
                </div>

                <Textarea
                  placeholder="Пример: 5 слайдов о будущем AI с графиками"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-24"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || requestsCount >= maxFreeRequests}
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      Создать
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={activeTab === "code" ? "secondary" : "ghost"}
                      onClick={() => setActiveTab("code")}
                      size="sm"
                      className="gap-2"
                    >
                      <FileCode className="h-4 w-4" />
                      VBA-код
                    </Button>
                    <Button
                      variant={activeTab === "preview" ? "secondary" : "ghost"}
                      onClick={() => setActiveTab("preview")}
                      size="sm"
                      className="gap-2"
                    >
                      <ScreenShare className="h-4 w-4" />
                      Превью
                    </Button>
                  </div>
                  {activeTab === "code" && result && (
                    <Button 
                      onClick={copyToClipboard} 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Копировать
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-auto p-4">
                {activeTab === "code" ? (
                  <div className="relative">
                    {result ? (
                      <pre className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        {result}
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Сгенерированный код появится здесь
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {presentationStructure?.success ? (
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <ScreenShare className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">
                              Структура презентации
                            </h2>
                            <p className="text-muted-foreground">
                              {presentationStructure.totalSlides} слайдов
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {presentationStructure?.slides?.map((slide, index) => (
                            <SlidePreview key={index} slide={slide} index={index} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        {result 
                          ? 'Не удалось распознать структуру презентации'
                          : 'Сгенерируйте код для просмотра структуры'}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Как использовать сгенерированный VBA-код</CardTitle>
            <CardDescription>
              Инструкция для запуска макроса в PowerPoint/Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed space-y-3">
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>
                Опишите желаемую презентацию в поле запроса и нажмите <strong>«Создать»</strong>.
              </li>
              <li>
                Переключитесь на вкладку <strong>VBA-код</strong> для копирования сгенерированного кода.
              </li>
              <li>
                Для просмотра структуры переключитесь на вкладку <strong>Превью</strong>.
              </li>
              <li>
                Откройте PowerPoint (или Excel) и нажмите <strong>Alt+F11</strong> для открытия редактора VBA.
              </li>
              <li>
                Создайте новый модуль или макрос и вставьте скопированный код.
              </li>
              <li>
                Запустите макрос для автоматического создания презентации.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground pt-2">
              Обратите внимание: предпросмотр отображается на основе анализа кода и работает, если код соответствует ожидаемому шаблону.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}