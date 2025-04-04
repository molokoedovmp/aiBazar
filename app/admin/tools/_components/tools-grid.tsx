"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import Image from "next/image"

export function ToolsGrid({ tools, categories, onEdit }: any) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools?.map((tool: any) => (
        <Card key={tool._id} className="overflow-hidden">
          <div className="relative h-40 w-full">
            <Image
              src={tool.coverImage || "/placeholder.png"}
              alt={tool.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{tool.name}</h3>
            <p className="text-sm text-muted-foreground">{getCategoryName(tool.categoryId)}</p>
            <div className="mt-2 flex justify-between">
              <span className="font-medium">{tool.price} ₽</span>
              <span 
                className={`px-2 py-1 rounded-full text-xs ${
                  tool.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}
              >
                {tool.isActive ? "Активен" : "Неактивен"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 