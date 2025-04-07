"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Pencil, AlertCircle, Lock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AiEditor, parseMarkdownToBlocks } from "@/components/ai-editor"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useUser } from "@clerk/clerk-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SignInButton } from "@clerk/clerk-react"

// Константа для гостевого лимита
const GUEST_REQUEST_LIMIT = 3

export default function AiBlogPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("информативный")
  const [tone, setTone] = useState("нейтральный")
  const [length, setLength] = useState("средняя")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  
  // Запрос к Convex для получения информации о лимитах пользователя
  const userCredits = useQuery(
    api.userCredits.getUserCredits, 
    isSignedIn ? { userId: user?.id } : "skip"
  )
  
  // Мутация для использования кредита
  const useCredit = useMutation(api.userCredits.useCredit)
  
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

  // Функция преобразования сгенерированного текста в блоки для редактора
  const convertToBlocks = (text: string) => {
    const blocks = parseMarkdownToBlocks(text);
    return JSON.stringify(blocks);
  }

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
      await useCredit({ userId: user.id, service: "ai-blog" });
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
    
    if (!prompt.trim()) return;
    
    // Сбрасываем предыдущий результат перед новой генерацией
    setResult("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, tone, length })
      });
      
      if (!response.ok) throw new Error(`Ошибка API: ${response.status}`);
      
      const data = await response.json();
      // Преобразуем сгенерированный текст с Markdown-разметкой в блоки
      setResult(convertToBlocks(data.response));
      
      toast.success("Статья успешно сгенерирована!");
    } catch (error) {
      console.error("Ошибка при генерации статьи:", error);
      toast.error("Ошибка генерации статьи");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    try {
      // Парсим JSON для получения блоков
      const blocks = JSON.parse(result);
      
      // Преобразуем блоки в текст
      let plainText = "";
      
      blocks.forEach((block: any) => {
        if (block.type === "heading") {
          const level = block.props?.level || 1;
          const prefix = "#".repeat(level) + " ";
          const text = block.content.map((item: any) => item.text).join("");
          plainText += prefix + text + "\n\n";
        } 
        else if (block.type === "bulletListItem") {
          const text = block.content.map((item: any) => item.text).join("");
          plainText += "- " + text + "\n";
        }
        else if (block.type === "numberedListItem") {
          const text = block.content.map((item: any) => item.text).join("");
          plainText += "1. " + text + "\n";
        }
        else {
          const text = block.content.map((item: any) => item.text).join("");
          plainText += text + "\n\n";
        }
      });
      
      navigator.clipboard.writeText(plainText);
      toast.success("Текст статьи скопирован!");
    } catch (error) {
      console.error("Ошибка при копировании текста:", error);
      toast.error("Не удалось скопировать текст");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Шапка */}
        <div className="mb-8">
          <Link href="/bazarius">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center">GPT для статей</h1>
          <p className="text-muted-foreground text-center mt-2">
            Генерация уникальных статей для вашего блога с помощью AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка: настройки и запрос */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-primary" />
                  Настройки генерации
                </CardTitle>
                <CardDescription>
                  Выберите параметры для улучшения промта. Эти настройки помогут AI написать качественную статью, даже если вы не знакомы с тонкостями.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Стиль</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="информативный">Информативный</option>
                    <option value="аналитический">Аналитический</option>
                    <option value="креативный">Креативный</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Тональность</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="нейтральный">Нейтральный</option>
                    <option value="оптимистичный">Оптимистичный</option>
                    <option value="формальный">Формальный</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Длина статьи</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="короткая">Короткая (300-500 слов)</option>
                    <option value="средняя">Средняя (800-1000 слов)</option>
                    <option value="длинная">Длинная (1500+ слов)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-primary" />
                  Ввод запроса
                </CardTitle>
                <CardDescription>
                  Опишите тему статьи и любые дополнительные детали, которые помогут AI понять ваши требования.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Например: 'Напиши статью о влиянии искусственного интеллекта на образование'"
                  className="min-h-[150px]"
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {/* Информация о лимите запросов */}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>Доступно запросов: {requestsRemaining} из {requestLimit}</span>
                    {isLimitReached && (
                      <span className="text-destructive font-medium">Лимит исчерпан</span>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(100, ((requestLimit - requestsRemaining) / requestLimit) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Предупреждение при достижении лимита */}
                {isLimitReached && (
                  <Alert variant={isSignedIn ? "default" : "destructive"} className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between w-full">
                      <span>
                        {isSignedIn 
                          ? "У вас закончились кредиты." 
                          : "Достигнут лимит гостевых запросов."}
                      </span>
                      {isSignedIn ? (
                        <Button size="sm" variant="outline" onClick={() => router.push("/bazarius/pricing")}>
                          Купить кредиты
                        </Button>
                      ) : (
                        <SignInButton mode="modal">
                          <Button size="sm" variant="outline">
                            <Lock className="h-3 w-3 mr-1" /> Войти
                          </Button>
                        </SignInButton>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !prompt.trim() || isLimitReached} 
                  className="w-full gap-2"
                >
                  {isLoading ? "Генерация..." : "Сгенерировать статью"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Правая колонка: редактор с результатом */}
          <div className="h-[calc(100vh-200px)] overflow-auto">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Редактор статьи</CardTitle>
                <CardDescription>
                  Отредактируйте сгенерированную статью при необходимости
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {result ? (
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={copyToClipboard}
                        className="flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
                          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        </svg>
                        Копировать
                      </Button>
                    </div>
                    <AiEditor 
                      initialContent={result}
                      onChange={(content) => setResult(content)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {isLoading ? "Идет генерация статьи..." : "Начните с ввода запроса"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Инструкция */}
        <Card>
          <CardHeader>
            <CardTitle>Как пользоваться сервисом</CardTitle>
          </CardHeader>
          <CardContent className="leading-relaxed">
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>
                Выберите настройки генерации: стиль, тональность и длину статьи.
              </li>
              <li>
                Введите тему статьи и дополнительные детали в текстовое поле.
              </li>
              <li>
                Нажмите <strong>"Сгенерировать статью"</strong> и дождитесь результата.
              </li>
              <li>
                Отредактируйте сгенерированную статью в редакторе при необходимости.
              </li>
              <li>
                Если предусмотрено, нажмите кнопку для копирования текста в буфер обмена.
              </li>
              <li>
                Используйте полученный текст для публикации или дальнейшего редактирования.
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              Примечание: Результат генерируется с помощью AI и может потребовать дополнительной редакции.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
