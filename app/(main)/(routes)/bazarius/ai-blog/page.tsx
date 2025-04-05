"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AiEditor } from "@/components/ai-editor"

export default function AiBlogPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("информативный")
  const [tone, setTone] = useState("нейтральный")
  const [length, setLength] = useState("средняя")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Функция преобразования сгенерированного текста в блоки для редактора
  const convertToBlocks = (text: string) => {
    return JSON.stringify(
      text.split("\n\n").map((paragraph, index) => ({
        id: `${Date.now()}-${index}`, // генерируем уникальный id
        type: "paragraph",
        content: [{ type: "text", text: paragraph.trim(), styles: {} }]
      }))
    );
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, tone, length })
      });
      if (!response.ok) throw new Error(`Ошибка API: ${response.status}`);
      const data = await response.json();
      // Преобразуем сгенерированный текст (предполагается, что он содержит Markdown-разметку)
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
    navigator.clipboard.writeText(result);
    toast.success("Текст статьи скопирован!");
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
              <CardFooter>
                <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className="w-full gap-2">
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
                  <AiEditor 
                    initialContent={result}
                    onChange={(content) => setResult(content)}
                  />
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
