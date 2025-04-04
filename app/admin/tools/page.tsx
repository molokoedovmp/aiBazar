"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
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
  Loader2, 
  RefreshCw, 
  Edit,
  Plus,
  Trash,
  Download,
  FileJson,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/app/admin/_components/image-upload"
import { Id } from "@/convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolsTable } from "./_components/tools-table"
import { ToolsGrid } from "./_components/tools-grid"
import * as XLSX from 'xlsx'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ToolsPage() {
  const aiTools = useQuery(api.aiTools.get)
  const categories = useQuery(api.categories.get) || []
  
  const updateAllPrices = useMutation(api.aiTools.updateAllPricesFromStartPrice)
  const updateTool = useMutation(api.aiTools.update)
  const createTool = useMutation(api.aiTools.create)
  const removeTool = useMutation(api.aiTools.remove)
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(90)
  
  // Состояние для редактирования инструмента
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  
  const [isExporting, setIsExporting] = useState(false)
  
  // Получаем имя категории по ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.name : "Неизвестная категория"
  }
  
  const handleUpdateAllPrices = async () => {
    setIsUpdating(true)
    try {
      const result = await updateAllPrices({ exchangeRate })
      setResults(result)
      setIsResultsOpen(true)
      toast.success(`Обновлено ${result.updatedCount} инструментов`)
    } catch (error) {
      console.error("Ошибка при обновлении цен:", error)
      toast.error("Ошибка при обновлении цен")
    } finally {
      setIsUpdating(false)
    }
  }
  
  const openEditDialog = (tool: any) => {
    setEditingTool({...tool})
    setSelectedCategory(tool.categoryId)
    setIsEditDialogOpen(true)
  }
  
  const handleEditChange = (field: string, value: any) => {
    setEditingTool({
      ...editingTool,
      [field]: value !== "" ? value : null
    })
    
    if (field === "categoryId") {
      setSelectedCategory(value)
    }
  }
  
  const handleSaveTool = async () => {
    if (!editingTool.name) {
      toast.error("Название инструмента обязательно")
      return
    }
    
    try {
      // Проверяем размер данных перед отправкой (для изображения)
      const imageSize = editingTool.coverImage ? 
        Math.round(editingTool.coverImage.length / 1024) : 0
      
      console.log("Размер изображения:", imageSize, "КБ")
      
      if (imageSize > 800) {
        toast.error("Изображение слишком большое. Максимальный размер: 800 КБ")
        return
      }
      
      if (editingTool._id) {
        await updateTool({
          id: editingTool._id,
          name: editingTool.name,
          description: editingTool.description,
          url: editingTool.url || "",
          type: editingTool.type || "tool",
          isActive: editingTool.isActive,
          rating: editingTool.rating || 0,
          price: editingTool.price !== null ? editingTool.price : 0,
          startPrice: editingTool.startPrice !== null ? editingTool.startPrice : 0,
          categoryId: selectedCategory as Id<"categories">,
          coverImage: editingTool.coverImage || ""
        })
        toast.success("Инструмент обновлен")
      } else {
        await createTool({
          name: editingTool.name,
          description: editingTool.description,
          url: editingTool.url || "",
          type: editingTool.type || "tool",
          isActive: editingTool.isActive,
          rating: editingTool.rating || 0,
          price: editingTool.price !== null ? editingTool.price : 0,
          startPrice: editingTool.startPrice !== null ? editingTool.startPrice : 0,
          categoryId: selectedCategory as Id<"categories">,
          coverImage: editingTool.coverImage || ""
        })
        toast.success("Инструмент создан")
      }
      
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при обновлении инструмента:", error)
      toast.error("Ошибка при обновлении инструмента")
    }
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
  
  const filteredTools = aiTools?.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Функция для экспорта в Excel
  const exportToExcel = () => {
    if (!aiTools) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = aiTools.map(tool => ({
        ID: tool._id,
        Название: tool.name,
        Описание: tool.description,
        Тип: tool.type,
        Цена: tool.price || 0,
        Рейтинг: tool.rating || 0,
        Активен: tool.isActive ? "Да" : "Нет",
        Категория: categories?.find(c => c._id === tool.categoryId)?.name || "Не указана",
        URL: tool.url || "",
        Изображение: tool.coverImage || ""
      }))
      
      // Создаем рабочую книгу Excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Инструменты")
      
      // Сохраняем файл
      XLSX.writeFile(workbook, "ai-tools-export.xlsx")
      
      console.log("Экспорт в Excel выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в Excel:", error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Функция для экспорта в JSON
  const exportToJSON = () => {
    if (!aiTools) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = aiTools.map(tool => ({
        id: tool._id,
        name: tool.name,
        description: tool.description,
        type: tool.type,
        price: tool.price || 0,
        rating: tool.rating || 0,
        isActive: tool.isActive,
        category: categories?.find(c => c._id === tool.categoryId)?.name || null,
        url: tool.url || null,
        coverImage: tool.coverImage || null
      }))
      
      // Создаем Blob с данными JSON
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "ai-tools-export.json"
      
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
  
  return (
    <div className="p-6">
      {/* Диалог с результатами обновления цен */}
      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Результаты обновления цен</DialogTitle>
            <DialogDescription>
              Обновлено {results?.updatedCount || 0} инструментов
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Стартовая цена ($)</TableHead>
                  <TableHead>Старая цена (₽)</TableHead>
                  <TableHead>Новая цена (₽)</TableHead>
                  <TableHead>Разница</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.details?.map((item: any) => {
                  const diff = item.newPrice - item.oldPrice
                  const diffClass = diff > 0 
                    ? "text-green-600" 
                    : diff < 0 
                      ? "text-red-600" 
                      : ""
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.startPrice}</TableCell>
                      <TableCell>{item.oldPrice} ₽</TableCell>
                      <TableCell>{item.newPrice} ₽</TableCell>
                      <TableCell className={diffClass}>
                        {diff > 0 ? "+" : ""}{diff} ₽
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsResultsOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление инструментами</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setEditingTool({
                name: "",
                description: "",
                type: "",
                price: 0,
                startPrice: 0,
                isActive: true,
                categoryId: categories[0]?._id || "",
                url: "",
                coverImage: ""
              });
              setSelectedCategory(categories[0]?._id || "");
              setIsEditDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Новый инструмент
          </Button>
          
          {/* Добавляем Popover для обновления цен */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Обновить цены
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Обновление цен</h4>
                <p className="text-sm text-muted-foreground">
                  Обновите цены всех инструментов на основе стартовой цены в долларах
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    id="exchangeRate"
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    min={1}
                    placeholder="Курс доллара"
                  />
                  <Button 
                    onClick={handleUpdateAllPrices}
                    disabled={isUpdating}
                    size="sm"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            onClick={exportToExcel} 
            disabled={isExporting || !aiTools}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Экспорт в Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToJSON} 
            disabled={isExporting || !aiTools}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
            Экспорт в JSON
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Поиск инструментов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI инструменты</CardTitle>
          <CardDescription>
            Управляйте инструментами AI, которые отображаются на вашем сайте.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Таблица</TabsTrigger>
              <TabsTrigger value="grid">Сетка</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <ToolsTable 
                tools={filteredTools} 
                categories={categories} 
                onEdit={openEditDialog} 
              />
            </TabsContent>
            <TabsContent value="grid">
              <ToolsGrid 
                tools={filteredTools} 
                categories={categories} 
                onEdit={openEditDialog} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Диалог редактирования инструмента */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTool?._id ? "Редактирование инструмента" : "Добавление нового инструмента"}
            </DialogTitle>
            <DialogDescription>
              {editingTool?._id ? "Измените информацию об инструменте" : "Введите информацию о новом инструменте"}
            </DialogDescription>
          </DialogHeader>
          
          {editingTool && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Название
                </Label>
                <Input
                  id="name"
                  value={editingTool.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Описание
                </Label>
                <Textarea
                  id="description"
                  value={editingTool.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={editingTool.url || ""}
                  onChange={(e) => handleEditChange("url", e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Категория
                </Label>
                <div className="col-span-3">
                  {categories && categories.length > 0 ? (
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={selectedCategory}
                      onChange={(e) => handleEditChange("categoryId", e.target.value)}
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Загрузка категорий... Если категории не появляются, 
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => window.location.reload()}
                      >
                        обновите страницу
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startPrice" className="text-right">
                  Стартовая цена ($)
                </Label>
                <Input
                  id="startPrice"
                  type="number"
                  value={editingTool.startPrice !== null 
                    ? editingTool.startPrice 
                    : ""}
                  onChange={(e) => 
                    handleEditChange(
                      "startPrice", 
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                  min={0}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Цена (₽)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editingTool.price !== null ? editingTool.price : ""}
                  onChange={(e) => 
                    handleEditChange(
                      "price", 
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="col-span-3"
                  min={0}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Рейтинг
                </Label>
                <Input
                  id="rating"
                  type="number"
                  value={editingTool.rating || ""}
                  onChange={(e) => handleEditChange("rating", e.target.value 
                    ? Number(e.target.value) 
                    : null
                  )}
                  className="col-span-3"
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Активен
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="isActive"
                    checked={editingTool.isActive}
                    onCheckedChange={(checked) => handleEditChange("isActive", checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="coverImage" className="text-right">
                  Изображение
                </Label>
                <div className="col-span-3">
                  <ImageUpload
                    value={editingTool.coverImage || ""}
                    onChange={(url) => handleEditChange("coverImage", url)}
                    label="Загрузить обложку инструмента"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveTool}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
