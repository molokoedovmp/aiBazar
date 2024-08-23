"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock,
  Block,
} from "@blocknote/core";
import {
  BlockNoteView,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { useEdgeStore } from "@/lib/edgestore";
import { HiOutlineTable } from "react-icons/hi";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({
  onChange,
  initialContent,
  editable,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  // Пользовательский пункт для вставки таблицы амам

  // Пользовательский элемент для вставки таблицы в Слэш меню

  // Использование useBlockNote с пользовательским элементом Слэш меню
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
    // Добавьте свои пользовательские элементы в slashMenuItems
  });

  // Возврат компонента редактора
  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
