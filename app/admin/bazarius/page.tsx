"use client";

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Edit, Plus, Trash } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/app/admin/_components/image-upload"
import { Id } from "@/convex/_generated/dataModel"

export default function AIBazarGPTPage() {
  const tools = useQuery(api.aibazargpt.getAll)
  const updateTool = useMutation(api.aibazargpt.update)
  const createTool = useMutation(api.aibazargpt.create)
  const removeTool = useMutation(api.aibazargpt.remove)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const openEditDialog = (tool: any = {}) => {
    setEditingTool({ ...tool })
    setIsEditDialogOpen(true)
  }

  const handleEditChange = (field: string, value: any) => {
    setEditingTool({ ...editingTool, [field]: value })
  }

  const handleSaveTool = async () => {
    if (!editingTool.title) {
      toast.error("Название обязательно")
      return
    }

    try {
      if (editingTool._id) {
        await updateTool(editingTool)
        toast.success("Инструмент обновлен")
      } else {
        await createTool(editingTool)
        toast.success("Инструмент создан")
      }
      setIsEditDialogOpen(false)
    } catch (error) {
      toast.error("Ошибка при сохранении инструмента")
    }
  }

  const handleDeleteTool = async (id: string) => {
    try {
      await removeTool({ id: id as Id<"aibazargpt"> })
      toast.success("Инструмент удален")
    } catch (error) {
      toast.error("Ошибка при удалении инструмента")
    }
  }

  const filteredTools = tools?.filter(tool => tool.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Управление инструментами</h1>
        <Button onClick={() => openEditDialog({})}>
          <Plus className="mr-2 h-4 w-4" /> Добавить инструмент
        </Button>
      </div>
      
      <Input placeholder="Поиск инструментов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="mb-4" />
      
      <Card>
        <CardHeader>
          <CardTitle>Список инструментов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools?.map((tool) => (
                <TableRow key={tool._id}>
                  <TableCell>{tool.title}</TableCell>
                  <TableCell>{tool.status}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(tool)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTool(tool._id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTool?._id ? "Редактирование инструмента" : "Добавление нового инструмента"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label>Название</Label>
            <Input value={editingTool?.title || ""} onChange={(e) => handleEditChange("title", e.target.value)} />
            <Label>Описание</Label>
            <Textarea value={editingTool?.description || ""} onChange={(e) => handleEditChange("description", e.target.value)} />
            <Label>Изображение</Label>
            <ImageUpload value={editingTool?.coverImage || ""} onChange={(url) => handleEditChange("coverImage", url)} />
            <Label>Статус</Label>
            <Input value={editingTool?.status || ""} onChange={(e) => handleEditChange("status", e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveTool}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
