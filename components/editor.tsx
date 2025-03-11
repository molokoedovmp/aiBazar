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

interface EditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialContent,
  editable = true,
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
      });
      
      if (!response.ok) {
        throw new Error("Ошибка при запросе к API");
      }
      
      const data = await response.json();
      const aiText = data.text || "Не удалось сгенерировать текст";
      
      // Добавляем логирование для отладки
      console.log("Полученный текст от API:", aiText);
      
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
      
      // Обрабатываем каждую строку и преобразуем в соответствующий блок
      for (let line of lines as string[]) {
        console.log("Обработка строки:", line);
        
        if (line.startsWith('# ')) {
          console.log("Определено как заголовок 1 уровня");
          newBlocks.push({
            type: "heading",
            props: { level: 1 },
            content: [{ type: "text", text: line.substring(2).trim(), styles: {} }],
          });
        } else if (line.startsWith('## ')) {
          console.log("Определено как заголовок 2 уровня");
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
      
      // Вставляем новые блоки в редактор
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
      
      // Обновляем содержимое и очищаем поле ввода
      const content = JSON.stringify(editor.topLevelBlocks, null, 2);
      onChange(content);
      setAiPrompt("");
      setIsAiOpen(false); // Закрываем попап после генерации
      
    } catch (error) {
      console.error("Ошибка при генерации текста:", error);
      // Можно добавить уведомление об ошибке
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
      {/* AI кнопка и попап */}
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