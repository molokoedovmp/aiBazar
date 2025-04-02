import { useTheme } from "next-themes";
import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@blocknote/core/style.css";
import { useEdgeStore } from "@/lib/edgestore";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface EditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
  hideAiAssistant?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialContent,
  editable = true,
  hideAiAssistant = false,
}) => {
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parseInitialContent = (content: string | undefined): PartialBlock[] | undefined => {
    if (!content) return undefined;
    try {
      return JSON.parse(content) as PartialBlock[];
    } catch (error) {
      console.error("Failed to parse initialContent:", error);
      return undefined;
    }
  };

  const handleUpload = async (file: File): Promise<string | Record<string, any>> => {
    try {
      const response = await edgestore.publicFiles.upload({
        file,
      });
      return response.url;
    } catch (error) {
      console.error("Failed to upload file:", error);
      return { error: "Upload failed" };
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: parseInitialContent(initialContent),
    uploadFile: handleUpload
  });

  const generateAiContent = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Получаем текущее содержимое редактора
      const currentContent = editor.topLevelBlocks;
      
      // Преобразуем блоки в текстовый формат для отправки в API
      const currentText = currentContent.map(block => {
        // Обработка разных типов блоков
        if (block.type === "heading") {
          const level = block.props?.level || 1;
          const prefix = "#".repeat(level) + " ";
          return prefix + (Array.isArray(block.content) && block.content[0]?.type === "text" ? block.content[0].text : "");
        } else if (block.type === "bulletListItem") {
          return "- " + (Array.isArray(block.content) && block.content[0]?.type === "text" ? block.content[0].text : "");
        } else if (block.type === "numberedListItem") {
          return "1. " + (Array.isArray(block.content) && block.content[0]?.type === "text" ? block.content[0].text : "");
        } else {
          return Array.isArray(block.content) && block.content[0]?.type === "text" ? block.content[0].text : "";
        }
      }).join("\n\n");
      
      // Определяем, является ли запрос редактированием
      const isEditing = aiPrompt.toLowerCase().includes("редактир") || 
                        aiPrompt.toLowerCase().includes("измен") ||
                        aiPrompt.toLowerCase().includes("исправ") || 
                        aiPrompt.toLowerCase().includes("ошибк") ||
                        aiPrompt.toLowerCase().includes("проверь");
      
      console.log("Отправка запроса к API:", { 
        prompt: aiPrompt,
        currentText: currentText.substring(0, 100) + "...", // Логируем только начало для отладки
        isEditing 
      });
      
      // Отправляем запрос к API с текущим содержимым и запросом пользователя
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          currentText: currentText,
          isEditing: isEditing // Передаем флаг редактирования
        }),
        // Добавляем таймаут и другие параметры для повышения надежности
        cache: 'no-store',
        signal: AbortSignal.timeout(30000) // 30 секунд таймаут
      });
      
      if (!response.ok) {
        console.error("Ошибка API:", response.status, response.statusText);
        throw new Error(`Ошибка при запросе к API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.text) {
        console.error("Пустой ответ от API:", data);
        throw new Error("API вернул пустой ответ");
      }
      
      const aiText = data.text;
      
      // Добавляем логирование для отладки
      console.log("Получен ответ от API, длина:", aiText.length);
      
      // Если это редактирование, заменяем весь текст
      if (isEditing) {
        console.log("Режим редактирования, удаляем старый текст");
        // Очищаем редактор только если есть содержимое
        if (currentContent.length > 0) {
          editor.removeBlocks(currentContent.map(block => block.id));
        }
      }
      
      // Разбиваем текст на строки и создаем новые блоки
      const lines = aiText.split(/\r?\n/).filter((line: string) => line.trim() !== "");
      const newBlocks: PartialBlock[] = [];
      
      console.log(`Обработка ${lines.length} строк текста`);
      
      // Обрабатываем каждую строку и преобразуем в соответствующий блок
      for (let line of lines as string[]) {
        if (line.startsWith('# ')) {
          newBlocks.push({
            type: "heading",
            props: { level: 1 },
            content: [{ type: "text", text: line.substring(2).trim(), styles: {} }],
          });
        } else if (line.startsWith('## ')) {
          newBlocks.push({
            type: "heading",
            props: { level: 2 },
            content: [{ type: "text", text: line.substring(3).trim(), styles: {} }],
          });
        } else if (line.startsWith('### ')) {
          newBlocks.push({
            type: "heading",
            props: { level: 3 },
            content: [{ type: "text", text: line.substring(4).trim(), styles: {} }],
          });
        } 
        // Обработка маркированных списков (- элемент, * элемент)
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          newBlocks.push({
            type: "bulletListItem",
            content: [{ type: "text", text: line.substring(2).trim(), styles: {} }],
          });
        } 
        // Обработка нумерованных списков (1. элемент)
        else if (/^\d+\.\s/.test(line)) {
          newBlocks.push({
            type: "numberedListItem",
            content: [{ type: "text", text: line.replace(/^\d+\.\s/, '').trim(), styles: {} }],
          });
        } 
        // Обычный текст
        else {
          newBlocks.push({
            type: "paragraph",
            content: [{ type: "text", text: line.trim(), styles: {} }],
          });
        }
      }
      
      console.log(`Создано ${newBlocks.length} новых блоков`);
      
      // Проверяем, что есть блоки для вставки
      if (newBlocks.length === 0) {
        console.warn("Нет блоков для вставки");
        throw new Error("Не удалось создать блоки из ответа AI");
      }
      
      // Вставляем новые блоки в редактор
      try {
        const blocks = editor.topLevelBlocks;
        
        if (isEditing || blocks.length === 0) {
          // Если это редактирование или редактор пуст, вставляем в начало
          console.log("Вставляем блоки в начало");
          editor.insertBlocks(newBlocks, "start");
        } else {
          // Иначе добавляем после существующего содержимого
          console.log("Добавляем блоки после существующего содержимого");
          editor.insertBlocks(
            newBlocks, 
            blocks[blocks.length - 1].id, 
            "after"
          );
        }
        
        // Добавляем выделение для новых блоков
        newBlocks.forEach(block => {
          if (block.content && Array.isArray(block.content) && block.content[0]) {
            const contentItem = block.content[0];
            // Проверяем, что это объект, а не строка
            if (typeof contentItem !== 'string' && contentItem.type === "text") {
              // Добавляем стиль для выделения сгенерированного текста
              contentItem.styles = {
                ...(contentItem.styles || {}),
                backgroundColor: "rgba(144, 202, 249, 0.2)" // Светло-голубой фон для выделения
              };
            }
          }
        });
        
        // Обновляем содержимое
        const content = JSON.stringify(editor.topLevelBlocks, null, 2);
        onChange(content);
        
        console.log("Блоки успешно вставлены и содержимое обновлено");
        
        // Показываем уведомление об успешной генерации
        toast.success("Текст успешно сгенерирован и добавлен в документ", {
          duration: 3000,
          position: "bottom-center"
        });
      } catch (insertError) {
        console.error("Ошибка при вставке блоков:", insertError);
        throw new Error(`Ошибка при вставке блоков: ${insertError instanceof Error ? insertError.message : 'Неизвестная ошибка'}`);
      }
      
      // Очищаем поле ввода и закрываем попап
      setAiPrompt("");
      setIsAiOpen(false);
      
    } catch (error) {
      console.error("Ошибка при генерации текста:", error);
      // Показываем уведомление об ошибке
      alert(`Ошибка при генерации текста: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAiContent();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="-mx-[54px] relative">
      {/* AI кнопка и попап - показываем только если hideAiAssistant=false */}
      {!hideAiAssistant && (
        <div className="absolute right-[60px] top-2 z-10">
          <Popover open={isAiOpen} onOpenChange={setIsAiOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
              >
                <Bot className="h-4 w-4 text-primary" />
                <span>AI - ассистент</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="end">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center">
                    <Bot className="h-4 w-4 mr-1 text-primary" />
                    Генерация текста с помощью AI
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => setIsAiOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                  <Input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Опишите, что нужно сгенерировать..."
                    className="flex-1"
                    disabled={isGenerating}
                  />
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      generateAiContent();
                    }} 
                    disabled={isGenerating || !aiPrompt.trim()}
                    size="sm"
                    className="whitespace-nowrap"
                    type="button"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        <span>Генерация...</span>
                      </>
                    ) : (
                      "Сгенерировать"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Введите запрос для генерации текста с помощью искусственного интеллекта. 
                  Результат будет добавлен в редактор.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* Редактор */}
      <div className="my-4">
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          onChange={() => {
            const content = JSON.stringify(editor.topLevelBlocks, null, 2);
            onChange(content);
          }}
        />
      </div>
    </div>
  );
};

export default Editor;