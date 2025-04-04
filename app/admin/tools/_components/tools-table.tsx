"use client"

import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"

export function ToolsTable({ tools, categories, onEdit }: any) {
  const removeTool = useMutation(api.aiTools.remove)

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((cat: any) => cat._id === categoryId)
    return category ? category.name : "Неизвестная категория"
  }

  const handleDeleteTool = async (id: string) => {
    try {
      await removeTool({ id: id as Id<"aiTools"> })
      toast.success("Инструмент удален")
    } catch (error) {
      console.error("Ошибка при удалении инструмента:", error)
      toast.error("Ошибка при удалении инструмента")
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Стартовая цена ($)</TableHead>
          <TableHead>Цена (₽)</TableHead>
          <TableHead>Рейтинг</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools?.map((tool: any) => (
          <TableRow key={tool._id}>
            <TableCell>{tool.name}</TableCell>
            <TableCell>{getCategoryName(tool.categoryId)}</TableCell>
            <TableCell>{tool.startPrice ?? "-"}</TableCell>
            <TableCell>{tool.price} ₽</TableCell>
            <TableCell>{tool.rating}</TableCell>
            <TableCell>
              <span 
                className={`px-2 py-1 rounded-full text-xs ${
                  tool.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}
              >
                {tool.isActive ? "Активен" : "Неактивен"}
              </span>
            </TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(tool)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTool(tool._id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 