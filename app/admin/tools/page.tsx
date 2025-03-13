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
  Trash
} from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/app/admin/_components/image-upload"
import { Id } from "@/convex/_generated/dataModel"

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
  
  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Обновление цен</CardTitle>
          <CardDescription>
            Обновите цены всех инструментов на основе стартовой цены в долларах
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="exchangeRate">Курс доллара</Label>
              <Input
                id="exchangeRate"
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                min={1}
              />
            </div>
            <Button 
              onClick={handleUpdateAllPrices}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обновление...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Обновить цены
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
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
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Управление инструментами</h1>
        <Button onClick={() => openEditDialog({})}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить инструмент
        </Button>
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
          <CardTitle>Список инструментов</CardTitle>
          <CardDescription>
            Всего инструментов: {filteredTools?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredTools?.map((tool) => (
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
                      onClick={() => openEditDialog(tool)}
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
