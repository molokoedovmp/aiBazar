"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Edit, 
  Trash, 
  Plus,
  Loader2,
  Download,
  FileJson
} from "lucide-react"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'

// Компонент таблицы категорий
function CategoriesTable({ categories, onEdit, onDelete }: any) {
  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium w-1/4">Название</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-1/2">Описание</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[150px]">Иконка</th>
            <th className="h-12 px-4 text-right align-middle font-medium w-[100px]">Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category: any) => (
            <tr key={category._id} className="border-b">
              <td className="p-4 align-middle font-medium">{category.name}</td>
              <td className="p-4 align-middle">
                <div className="truncate max-w-md">
                  {category.description || "-"}
                </div>
              </td>
              <td className="p-4 align-middle">
                <div className="truncate max-w-[120px]">
                  {category.icon || "-"}
                </div>
              </td>
              <td className="p-4 align-middle text-right whitespace-nowrap">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 inline-flex"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(category._id)}
                  className="h-8 w-8 inline-flex"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          
          {(!categories || categories.length === 0) && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                Нет категорий
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Компонент сетки категорий
function CategoriesGrid({ categories, onEdit, onDelete }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories?.map((category: any) => (
        <Card key={category._id} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {category.description || "Нет описания"}
            </p>
            {category.icon && (
              <div className="mt-2">
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {category.icon}
                </span>
              </div>
            )}
          </CardContent>
          <div className="p-4 pt-0 flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(category._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      
      {(!categories || categories.length === 0) && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          Нет категорий
        </div>
      )}
    </div>
  )
}

export default function CategoriesPage() {
  const categories = useQuery(api.categories.get)
  const createCategory = useMutation(api.categories.create)
  const updateCategory = useMutation(api.categories.update)
  const deleteCategory = useMutation(api.categories.remove)
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  const openEditDialog = (category: any) => {
    setEditingCategory({...category})
    setIsEditDialogOpen(true)
  }
  
  const handleEditChange = (field: string, value: any) => {
    setEditingCategory({
      ...editingCategory,
      [field]: value
    })
  }
  
  const handleSaveCategory = async () => {
    if (!editingCategory.name) {
      toast.error("Название категории обязательно")
      return
    }
    
    setIsLoading(true)
    try {
      // Если у категории есть ID, обновляем её, иначе создаем новую
      if (editingCategory._id) {
        await updateCategory({
          id: editingCategory._id,
          name: editingCategory.name,
          description: editingCategory.description || "",
          icon: editingCategory.icon || ""
        })
        toast.success("Категория обновлена")
      } else {
        await createCategory({
          name: editingCategory.name,
          description: editingCategory.description || "",
          icon: editingCategory.icon || ""
        })
        toast.success("Категория создана")
      }
      
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при сохранении категории:", error)
      toast.error("Ошибка при сохранении категории")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteCategory = async (id: any) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await deleteCategory({ id })
        toast.success("Категория удалена")
      } catch (error: any) {
        console.error("Ошибка при удалении категории:", error)
        toast.error(error.message || "Ошибка при удалении категории")
      }
    }
  }
  
  // Функция для экспорта в Excel
  const exportToExcel = () => {
    if (!categories) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = categories.map(category => ({
        ID: category._id,
        Название: category.name,
        Описание: category.description || "",
        Иконка: category.icon || ""
      }))
      
      // Создаем рабочую книгу Excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Категории")
      
      // Сохраняем файл
      XLSX.writeFile(workbook, "categories-export.xlsx")
      
      console.log("Экспорт в Excel выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в Excel:", error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Функция для экспорта в JSON
  const exportToJSON = () => {
    if (!categories) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = categories.map(category => ({
        id: category._id,
        name: category.name,
        description: category.description || "",
        icon: category.icon || ""
      }))
      
      // Создаем Blob с данными JSON
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "categories-export.json"
      
      // Симулируем клик для скачивания
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log("Экспорт в JSON выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в JSON:", error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Фильтрация категорий по поисковому запросу
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление категориями</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setEditingCategory({
                name: "",
                description: "",
                icon: ""
              })
              setIsEditDialogOpen(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Новая категория
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToExcel} 
            disabled={isExporting || !categories}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Экспорт в Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToJSON} 
            disabled={isExporting || !categories}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
            Экспорт в JSON
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Поиск категорий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Категории</CardTitle>
          <CardDescription>
            Управляйте категориями для инструментов AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Таблица</TabsTrigger>
              <TabsTrigger value="grid">Сетка</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <CategoriesTable 
                categories={filteredCategories} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteCategory}
              />
            </TabsContent>
            <TabsContent value="grid">
              <CategoriesGrid 
                categories={filteredCategories} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteCategory}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Диалог редактирования/создания категории */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?._id ? "Редактирование категории" : "Создание категории"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory?._id 
                ? "Измените информацию о категории" 
                : "Добавьте новую категорию"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={editingCategory?.name || ""}
                onChange={(e) => handleEditChange("name", e.target.value)}
                placeholder="Введите название категории"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={editingCategory?.description || ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
                placeholder="Введите описание категории"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Иконка</Label>
              <Input
                id="icon"
                value={editingCategory?.icon || ""}
                onChange={(e) => handleEditChange("icon", e.target.value)}
                placeholder="Например: FiHome, FiSettings"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveCategory} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingCategory?._id ? "Сохранение..." : "Создание..."}
                </>
              ) : (
                editingCategory?._id ? "Сохранить" : "Создать"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
