"use client"

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
import { toast } from "sonner";

/* ------------------ Markdown Parser ------------------ */

/**
 * Преобразует Markdown-разметку в блоки для BlockNote.
 * Обрабатывает заголовки (#, ##, ###), маркированные списки (-, *) и нумерованные списки (1. ...),
 * а также инлайновую разметку для жирного текста, заключённого в **.
 */
export function parseMarkdownToBlocks(markdown: string): PartialBlock[] {
  const lines = markdown.split(/\r?\n/).filter(line => line.trim() !== "");
  const blocks: PartialBlock[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      blocks.push(createHeadingBlock(line.substring(4).trim(), 3));
    } else if (line.startsWith("## ")) {
      blocks.push(createHeadingBlock(line.substring(3).trim(), 2));
    } else if (line.startsWith("# ")) {
      blocks.push(createHeadingBlock(line.substring(2).trim(), 1));
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.substring(2).trim();
      blocks.push({
        type: "bulletListItem",
        content: parseInlineMarkdown(text),
      });
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, "").trim();
      blocks.push({
        type: "numberedListItem",
        content: parseInlineMarkdown(text),
      });
    } else {
      blocks.push({
        type: "paragraph",
        content: parseInlineMarkdown(line.trim()),
      });
    }
  }

  return blocks;
}

function createHeadingBlock(text: string, level: number): PartialBlock {
  return {
    type: "heading",
    props: { level: level as 1 | 2 | 3 | undefined },
    content: parseInlineMarkdown(text),
  };
}

/**
 * Парсит инлайновую разметку в строке и возвращает массив объектов.
 * Обрабатывается только жирный текст, заключённый в **.
 */
function parseInlineMarkdown(line: string) {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const result: { type: "text"; text: string; styles: { bold?: boolean } }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      result.push({
        type: "text",
        text: line.substring(lastIndex, match.index),
        styles: {}
      });
    }
    result.push({
      type: "text",
      text: match[1],
      styles: { bold: true }
    });
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    result.push({
      type: "text",
      text: line.substring(lastIndex),
      styles: {}
    });
  }
  
  return result;
}

/* ------------------ Компонент редактора ------------------ */

interface AiEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
  hideAiAssistant?: boolean;
}

export const AiEditor: React.FC<AiEditorProps> = ({
  onChange,
  initialContent,
  editable = true,
  hideAiAssistant = false,
}) => {
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const parseInitialContent = (): PartialBlock[] | undefined => {
    if (!initialContent) return undefined;
    try {
      return JSON.parse(initialContent) as PartialBlock[];
    } catch (error) {
      console.error("Error parsing initial content:", error);
      return [];
    }
  };

  const handleUpload = async (file: File): Promise<string | Record<string, any>> => {
    try {
      const response = await edgestore.publicFiles.upload({ file });
      return response.url;
    } catch (error) {
      console.error("Failed to upload file:", error);
      return { error: "Upload failed" };
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: parseInitialContent(),
    uploadFile: handleUpload
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full">
      <div className="prose dark:prose-invert">
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          onChange={() => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
          }}
        />
      </div>
    </div>
  );
};

export default AiEditor;
