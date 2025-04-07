"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Copy, FileCode, CheckCircle, Power, ScreenShare, Lock, AlertCircle, FileImage, Table, BarChart, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SignInButton } from "@clerk/clerk-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Определение типа для слайда
interface Slide {
  title: string;
  content: string;
  layout: string;
  images: number;
  bullets: string[];
  hasTable: boolean;
  hasChart: boolean;
}

// Типизация результата parseVbaCode
interface ParsedVbaResult {
  success: true;
  totalSlides: number;
  slides: Slide[];
}

interface ParsedVbaError {
  success: false;
  error: string;
}

type ParsedVbaData = ParsedVbaResult | ParsedVbaError;

// Улучшенная функция для извлечения текстового содержимого слайда
const extractTextContent = (slideContent: string, title: string): string => {
  let content = "";
  
  // Более расширенный поиск текстового содержимого
  const textPatterns = [
    /\.TextFrame\.TextRange\.Text\s*=\s*"([^"]*)"/g,   // Стандартный текст
    /\.Text\s*=\s*"([^"]*)"/g,                         // Простой текст
    /\.Range\.Text\s*=\s*"([^"]*)"/g,                  // Текстовый диапазон
    /\.Value\s*=\s*"([^"]*)"/g                         // Текстовые значения
  ];
  
  for (const pattern of textPatterns) {
    let match;
    const regex = new RegExp(pattern);
    while ((match = regex.exec(slideContent)) !== null) {
      if (match[1] && match[1] !== title && match[1].trim().length > 0) {
        content += match[1] + "\n";
      }
    }
  }
  
  return content.trim();
};

// Улучшенная функция для извлечения всего текстового содержимого из кода
function extractAllTextContent(code: string): string[] {
  const textPatterns = [
    /\.TextFrame\.TextRange\.Text\s*=\s*"([^"]*)"/g,
    /\.Text\s*=\s*"([^"]*)"/g,
    /\.Range\.Text\s*=\s*"([^"]*)"/g,
    /\.Value\s*=\s*"([^"]*)"/g
  ];
  
  const allContent: string[] = [];
  
  for (const pattern of textPatterns) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        // Избегаем дубликатов
        if (!allContent.includes(match[1])) {
          allContent.push(match[1]);
        }
      }
    }
  }
  
  return allContent;
}

// Улучшенная функция для парсинга VBA-кода
const parseVbaCode = (code: string): ParsedVbaData => {
  if (!code || code.trim().length === 0) {
    return {
      success: false,
      error: 'Код не был сгенерирован'
    };
  }
  
  try {
    console.log("Парсинг VBA кода, длина:", code.length);
    const slides: Slide[] = [];
    
    // Несколько паттернов для поиска добавления слайдов
    const slidePatterns = [
      /ActivePresentation\.Slides\.Add\(([\s\S]*?)(?=ActivePresentation\.Slides\.Add|End Sub|$)/g,
      /\.Slides\.Add\s*\(?(\d+),\s*(\w+)/g,
      /\.Add\s*(\d+),\s*ppLayout/g
    ];
    
    // Регулярные выражения для извлечения информации
    const titleRegex = /\.TextFrame\.TextRange\.Text\s*=\s*"([^"]*)"/;
    const contentRegex = /\.TextFrame\.TextRange\.Text\s*=\s*"([^"]*)"/g;
    const layoutRegex = /\.Add\s*\(?(?:\d+)?,\s*(\w+)/;
    const bulletsRegex = /\.Paragraphs\(\d+\)\.Text\s*=\s*"([^"]+)"/g;
    const tableRegex = /\.AddTable|\.Table/;
    const chartRegex = /\.AddChart|\.Chart/;
    const pictureRegex = /\.AddPicture|\.Picture/;
    
    // Ищем слайды
    let slideMatches = false;
    let slideContent;
    
    // Попробуем первый паттерн - самый точный
    const mainPattern = /ActivePresentation\.Slides\.Add\(([\s\S]*?)(?=ActivePresentation\.Slides\.Add|End Sub|$)/g;
    let match;
    
    while ((match = mainPattern.exec(code)) !== null) {
      slideMatches = true;
      slideContent = match[0];
      
      // Извлекаем заголовок
      const titleMatch = titleRegex.exec(slideContent);
      const title = titleMatch ? titleMatch[1] : 'Без названия';
      
      // Определяем макет слайда
      const layoutMatch = layoutRegex.exec(slideContent);
      let layout = "Стандартный";
      if (layoutMatch) {
        const layoutType = layoutMatch[1];
        switch (layoutType) {
          case "ppLayoutTitle": layout = "Титульный слайд"; break;
          case "ppLayoutText": layout = "Слайд с текстом"; break;
          case "ppLayoutTwoColumnText": layout = "Две колонки"; break;
          case "ppLayoutTitleOnly": layout = "Только заголовок"; break;
          default: layout = layoutType;
        }
      }
      
      // Извлекаем количество изображений
      const imagesCount = (slideContent.match(pictureRegex) || []).length;
      
      // Извлекаем текстовое содержимое с улучшенной функцией
      const content = extractTextContent(slideContent, title);
      
      // Извлекаем маркированные списки
      const bullets: string[] = [];
      let bulletMatch;
      let bulletsRegexCopy = new RegExp(bulletsRegex);
      while ((bulletMatch = bulletsRegexCopy.exec(slideContent)) !== null) {
        bullets.push(bulletMatch[1]);
      }
      
      // Проверяем наличие таблиц и диаграмм
      const hasTable = tableRegex.test(slideContent);
      const hasChart = chartRegex.test(slideContent);
      
      // Добавляем информацию о слайде
      slides.push({
        title,
        content,
        layout,
        images: imagesCount,
        bullets,
        hasTable,
        hasChart
      });
    }
    
    // Если не нашли слайды по первому паттерну, пробуем другие
    if (!slideMatches) {
      console.log("Не нашли слайды по основному паттерну, пробуем альтернативные");
      
      // Иногда код может быть сгенерирован иначе - ищем по простому паттерну
      const slideCount = (code.match(/\.Slides\.Add/g) || []).length;
      
      if (slideCount > 0) {
        // Создаем базовые слайды по количеству найденных .Slides.Add
        for (let i = 0; i < slideCount; i++) {
          slides.push({
            title: `Слайд ${i+1}`,
            content: "Содержимое слайда",
            layout: "Стандартный",
            images: 0,
            bullets: [],
            hasTable: false,
            hasChart: false
          });
        }
        
        // Пытаемся найти какую-то информацию для каждого слайда
        const allTitles = Array.from(code.matchAll(/\.Text\s*=\s*"([^"]*)"/g))
          .map(m => m[1])
          .filter(t => t.length > 0);
        
        for (let i = 0; i < Math.min(slides.length, allTitles.length); i++) {
          slides[i].title = allTitles[i];
        }
        
        // Ищем другие элементы
        slides.forEach((slide, index) => {
          slide.hasTable = tableRegex.test(code);
          slide.hasChart = chartRegex.test(code);
          slide.images = (code.match(pictureRegex) || []).length;
          
          // Попытка найти маркированные списки
          const bulletMatches = Array.from(code.matchAll(/\.Paragraphs\(\d+\)\.Text\s*=\s*"([^"]+)"/g));
          if (bulletMatches.length > 0) {
            // Распределяем списки по слайдам
            const bulletsPerSlide = Math.ceil(bulletMatches.length / slides.length);
            const startIdx = index * bulletsPerSlide;
            const endIdx = Math.min(startIdx + bulletsPerSlide, bulletMatches.length);
            
            for (let i = startIdx; i < endIdx; i++) {
              if (bulletMatches[i]) {
                slide.bullets.push(bulletMatches[i][1]);
              }
            }
          }
        });
      }
    }
    
    // После создания базовых слайдов, улучшите извлечение содержимого

    // Пытаемся найти текстовое содержимое
    const allContent = extractAllTextContent(code);
    if (allContent.length > 0) {
      // Распределяем найденный текст между слайдами
      const contentPerSlide = Math.max(1, Math.ceil(allContent.length / slides.length));
      
      for (let i = 0; i < slides.length; i++) {
        const startIdx = i * contentPerSlide;
        const contentItems = allContent.slice(startIdx, startIdx + contentPerSlide);
        if (contentItems.length > 0) {
          slides[i].content = contentItems.join("\n");
        }
      }
    }
    
    console.log(`Найдено ${slides.length} слайдов`);
    
    if (slides.length === 0) {
      // Если слайды не найдены, возможно код некорректен
      return {
        success: false,
        error: 'Не удалось найти слайды в коде. Возможно, код имеет нестандартную структуру.'
      };
    }
    
    return {
      success: true,
      totalSlides: slides.length,
      slides
    };
  } catch (error) {
    console.error("Ошибка при парсинге VBA кода:", error);
    return {
      success: false,
      error: 'Не удалось распознать структуру презентации'
    };
  }
};

// Улучшенный компонент для предварительного просмотра слайда
const SlidePreview = ({ slide, index }: { slide: Slide, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
  >
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
          {index + 1}
        </div>
        <h3 className="font-semibold truncate">{slide.title}</h3>
        <span className="text-xs text-muted-foreground ml-auto">{slide.layout}</span>
      </div>
    </div>
    
    <div className="p-4">
      {/* Отображаем содержимое слайда */}
      {slide.content && (
        <div className="mb-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {slide.content}
        </div>
      )}
      
      {/* Отображаем маркированные списки */}
      {slide.bullets.length > 0 && (
        <ul className="text-sm list-disc list-inside text-gray-600 dark:text-gray-300 pl-2 space-y-1">
          {slide.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      )}
      
      {/* Иконки для изображений, таблиц и диаграмм */}
      <div className="flex gap-2 mt-3">
        {slide.images > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileImage className="h-3 w-3" />
            <span>{slide.images} {slide.images === 1 ? 'изображение' : 'изображения'}</span>
          </div>
        )}
        
        {slide.hasTable && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Table className="h-3 w-3" />
            <span>Таблица</span>
          </div>
        )}
        
        {slide.hasChart && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart className="h-3 w-3" />
            <span>Диаграмма</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
)

// Компонент для предварительного просмотра презентации
const PresentationPreview = ({ vbaCode }: { vbaCode: string }) => {
  // Добавьте логирование для входного кода
  console.log("VBA код для парсинга (первые 100 символов):", vbaCode?.substring(0, 100));
  
  const parsedData = parseVbaCode(vbaCode)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Добавьте логирование результата парсинга
  console.log("Результат парсинга:", parsedData.success ? 
    `Успех: ${parsedData.totalSlides} слайдов` : 
    `Ошибка: ${parsedData.error}`);
  
  if (!parsedData.success) {
    return (
      <div className="text-center p-4 text-red-500 dark:text-red-400">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{parsedData.error}</p>
        
        {/* Добавьте возможность посмотреть код для отладки */}
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            Показать код для отладки
          </summary>
          <pre className="mt-2 text-xs overflow-auto bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-40">
            {vbaCode}
          </pre>
        </details>
      </div>
    )
  }
  
  const { totalSlides, slides } = parsedData
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Предпросмотр презентации</h3>
        <div className="text-sm text-muted-foreground">
          {totalSlides} {totalSlides === 1 ? 'слайд' : 'слайдов'}
        </div>
      </div>
      
      {/* Навигация по слайдам */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">
          Слайд {currentSlide + 1} из {totalSlides}
        </span>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentSlide === totalSlides - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Текущий слайд */}
      <div className="p-4 border rounded-lg dark:border-gray-800">
        {slides[currentSlide] && 
          <SlidePreview slide={slides[currentSlide]} index={currentSlide} />
        }
      </div>
      
      {/* Миниатюры всех слайдов */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`cursor-pointer transition-all ${currentSlide === index ? 'ring-2 ring-primary' : 'opacity-70'}`}
            onClick={() => setCurrentSlide(index)}
          >
            <SlidePreview slide={slide} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Константа для гостевого лимита
const GUEST_REQUEST_LIMIT = 3

export default function AiPresentationPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  const { user, isSignedIn } = useUser()
  
  // Запрос к Convex для получения информации о лимитах пользователя
  const userCredits = useQuery(
    api.userCredits.getUserCredits, 
    isSignedIn ? { userId: user?.id } : "skip"
  )
  
  // Мутация для использования кредита
  const creditMutation = useMutation(api.userCredits.useCredit)
  
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
  
  const isLimitReached = requestsRemaining <= 0

  const presentationStructure = useMemo(() => 
    result ? parseVbaCode(result) : null, 
  [result])

  // Функция для проверки и списания кредита
  const checkAndDeductCredit = async () => {
    // Проверяем лимит запросов
    if (isLimitReached) {
      toast.error(isSignedIn 
        ? "У вас закончились кредиты. Приобретите дополнительные кредиты для продолжения." 
        : "Достигнут лимит гостевых запросов. Авторизуйтесь для продолжения."
      );
      return false;
    }
    
    // Уменьшаем счетчик кредитов
    if (isSignedIn && user) {
      await creditMutation({ userId: user.id, service: "ai-presentation" });
    } else {
      // Для гостей используем localStorage
      const newCount = guestRequestCount + 1;
      setGuestRequestCount(newCount);
      localStorage.setItem("guest-bazarius-requests", newCount.toString());
    }
    
    return true;
  }

  // Обработчик отправки формы
  const handleSubmit = async () => {
    // Проверяем возможность использования кредита
    const canProceed = await checkAndDeductCredit();
    if (!canProceed) {
      return;
    }
    
    if (!query.trim()) return;
    
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
          <Link href="/bazarius">
            <Button variant="ghost" className="mb-4 pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад 
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
                    <div className={`w-2 h-2 rounded-full ${isLimitReached ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm font-medium">
                      Осталось: {requestsRemaining}/{requestLimit}
                    </span>
                  </div>
                  {isLimitReached && (
                    isSignedIn ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => router.push('/bazarius/pricing')}
                      >
                        Купить кредиты
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button size="sm" variant="outline">
                          <Lock className="h-3 w-3 mr-1" /> Войти
                        </Button>
                      </SignInButton>
                    )
                  )}
                </div>

                {isLimitReached && (
                  <Alert variant={isSignedIn ? "default" : "destructive"} className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between w-full">
                      <span>
                        {isSignedIn 
                          ? "У вас закончились кредиты." 
                          : "Достигнут лимит гостевых запросов."}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                <Textarea
                  placeholder="Пример: 5 слайдов о будущем AI с графиками"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-24"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !query.trim() || isLimitReached}
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