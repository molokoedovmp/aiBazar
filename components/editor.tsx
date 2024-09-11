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

  if (!mounted) {
    return null;
  }

  return (
    <div className="-mx-[54px] my-4">
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
  );
};

export default Editor;