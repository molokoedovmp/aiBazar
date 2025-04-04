"use client";

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Edit, Trash, Eye, Plus, Download, FileJson, Loader2 } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Badge } from "@/components/ui/badge"
import React from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Обновляем интерфейс в соответствии с реальной структурой данных
interface BazariusItem {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  price: number | "Бесплатно";
  coverImage?: string;
  previewUrl?: string;
  icon: string;
  type: string;
  features: string[];
  status: string; // Вместо isActive используем status
  details: {
    // Добавьте поля, которые есть в details
  };
}

// Компонент таблицы Bazarius
function BazariusTable({ items, onEdit, onDelete, onSort }: any) {
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium">Название</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-1/3">Описание</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[120px]">Цена</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[120px]">Статус</th>
            <th 
              className="h-12 px-4 text-left align-middle font-medium w-[180px] cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('date')}
            >
              Дата ↕
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium w-[100px]">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item: BazariusItem) => (
            <tr key={item._id} className="border-b">
              <td className="p-4 align-middle font-medium">
                <div className="truncate max-w-[200px]">
                  {item.title}
                </div>
              </td>
              <td className="p-4 align-middle">
                <div className="truncate max-w-md">
                  {item.description}
                </div>
              </td>
              <td className="p-4 align-middle">{item.price} ₽</td>
              <td className="p-4 align-middle">
                {item.status === "active" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активен</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Неактивен</Badge>
                )}
              </td>
              <td className="p-4 align-middle">
                {formatDate(item._creationTime)}
              </td>
              <td className="p-4 align-middle text-right whitespace-nowrap">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 inline-flex"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(item._id)}
                  className="h-8 w-8 inline-flex"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          
          {(!items || items.length === 0) && (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Нет элементов
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Компонент сетки Bazarius
function BazariusGrid({ items, onEdit, onDelete }: any) {
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items?.map((item: BazariusItem) => (
        <Card key={item._id} className="overflow-hidden">
          {item.coverImage && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={item.coverImage} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate max-w-[200px]">
                {item.title}
              </h3>
              {item.status === "active" ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активен</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Неактивен</Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="line-clamp-2 text-muted-foreground">
                {item.description}
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Цена:</span>
                <span className="font-medium">{item.price} ₽</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span>{formatDate(item._creationTime)}</span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 pt-0 flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      
      {(!items || items.length === 0) && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          Нет элементов
        </div>
      )}
    </div>
  )
}

export default function BazariusPage() {
  // Запросы к API
  const bazariusItems = useQuery(api.aibazargpt.getAll)
  const createItem = useMutation(api.aibazargpt.create)
  const updateItem = useMutation(api.aibazargpt.update)
  const removeItem = useMutation(api.aibazargpt.remove) // Используем remove вместо delete
  
  // Состояния
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Функция для открытия диалога редактирования
  const openEditDialog = (item?: any) => {
    if (item) {
      setEditingItem({...item})
    } else {
      setEditingItem({
        title: "",
        description: "",
        price: 0,
        coverImage: "",
        icon: "",
        type: "ai",
        features: [],
        status: "active",
        details: {
          overview: "",
          capabilities: [],
          requirements: [],
          useCases: []
        }
      })
    }
    setIsEditDialogOpen(true)
  }
  
  // Функция для обработки изменений в форме
  const handleEditChange = (field: string, value: any) => {
    setEditingItem({
      ...editingItem,
      [field]: value
    })
  }
  
  // Функция для сохранения элемента
  const handleSaveItem = async () => {
    try {
      if (editingItem._id) {
        // Обновление существующего элемента
        await updateItem({
          id: editingItem._id as Id<"aibazargpt">,
          title: editingItem.title,
          description: editingItem.description,
          price: editingItem.price,
          coverImage: editingItem.coverImage,
          icon: editingItem.icon,
          type: editingItem.type,
          features: editingItem.features,
          status: editingItem.status,
          previewUrl: editingItem.previewUrl,
          details: editingItem.details
        })
        toast.success("Элемент успешно обновлен")
      } else {
        // Создание нового элемента
        await createItem({
          title: editingItem.title,
          description: editingItem.description,
          price: editingItem.price,
          coverImage: editingItem.coverImage,
          icon: editingItem.icon,
          type: editingItem.type,
          features: editingItem.features,
          status: editingItem.status,
          previewUrl: editingItem.previewUrl,
          details: editingItem.details
        })
        toast.success("Элемент успешно создан")
      }
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при сохранении элемента:", error)
      toast.error("Ошибка при сохранении элемента")
    }
  }
  
  // Функция для удаления элемента
  const handleDeleteItem = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот элемент?")) {
      try {
        await removeItem({ id: id as Id<"aibazargpt"> })
        toast.success("Элемент успешно удален")
      } catch (error) {
        console.error("Ошибка при удалении элемента:", error)
        toast.error("Ошибка при удалении элемента")
      }
    }
  }
  
  // Функция для сортировки по дате
  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }
  
  // Функция для экспорта в Excel
  const exportToExcel = () => {
    if (!bazariusItems) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = bazariusItems.map((item: BazariusItem) => ({
        ID: item._id,
        Название: item.title,
        Описание: item.description,
        Цена: item.price + " ₽",
        Статус: item.status === "active" ? "Активен" : "Неактивен",
        Дата_создания: new Date(item._creationTime).toLocaleString("ru-RU")
      }))
      
      // Создаем рабочую книгу Excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bazarius")
      
      // Сохраняем файл
      XLSX.writeFile(workbook, "bazarius-export.xlsx")
      
      console.log("Экспорт в Excel выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в Excel:", error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Функция для экспорта в JSON
  const exportToJSON = () => {
    if (!bazariusItems) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = bazariusItems.map((item: BazariusItem) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        price: item.price,
        coverImage: item.coverImage,
        status: item.status,
        createdAt: item._creationTime
      }))
      
      // Создаем Blob с данными JSON
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "bazarius-export.json"
      
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
  
  // Фильтрация и сортировка элементов
  const processedItems = React.useMemo(() => {
    if (!bazariusItems) return []
    
    // Сначала фильтруем
    let result = bazariusItems.filter((item: BazariusItem) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Затем сортируем
    result = [...result].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a._creationTime - b._creationTime
      } else {
        return b._creationTime - a._creationTime
      }
    })
    
    return result
  }, [bazariusItems, searchQuery, sortDirection])
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление Bazarius</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel} 
            disabled={isExporting || !bazariusItems}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Экспорт в Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToJSON} 
            disabled={isExporting || !bazariusItems}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
            Экспорт в JSON
          </Button>
          <Button 
            onClick={() => openEditDialog()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Поиск элементов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Элементы Bazarius</CardTitle>
          <CardDescription>
            Управляйте элементами Bazarius.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Таблица</TabsTrigger>
              <TabsTrigger value="grid">Сетка</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <BazariusTable 
                items={processedItems} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteItem}
                onSort={handleSort}
              />
            </TabsContent>
            <TabsContent value="grid">
              <BazariusGrid 
                items={processedItems} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteItem}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Диалог редактирования/создания элемента */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem?._id ? "Редактирование элемента" : "Создание элемента"}
            </DialogTitle>
            <DialogDescription>
              {editingItem?._id 
                ? "Измените информацию об элементе" 
                : "Добавьте новый элемент"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={editingItem?.title || ""}
                onChange={(e) => handleEditChange("title", e.target.value)}
                placeholder="Введите название"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={editingItem?.description || ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
                placeholder="Введите описание"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Цена</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="price"
                  type="number"
                  value={typeof editingItem?.price === 'number' ? editingItem.price : 0}
                  onChange={(e) => handleEditChange("price", Number(e.target.value))}
                  placeholder="Введите цену"
                  disabled={editingItem?.price === "Бесплатно"}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    id="free"
                    checked={editingItem?.price === "Бесплатно"}
                    onCheckedChange={(checked) => 
                      handleEditChange("price", checked ? "Бесплатно" : 0)
                    }
                  />
                  <Label htmlFor="free">Бесплатно</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Тип</Label>
              <Select
                value={editingItem?.type || ""}
                onValueChange={(value) => handleEditChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="tool">Инструмент</SelectItem>
                  <SelectItem value="service">Сервис</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Иконка (URL)</Label>
              <Input
                id="icon"
                value={editingItem?.icon || ""}
                onChange={(e) => handleEditChange("icon", e.target.value)}
                placeholder="Введите URL иконки"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">Обложка (URL)</Label>
              <Input
                id="coverImage"
                value={editingItem?.coverImage || ""}
                onChange={(e) => handleEditChange("coverImage", e.target.value)}
                placeholder="Введите URL обложки"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previewUrl">URL превью</Label>
              <Input
                id="previewUrl"
                value={editingItem?.previewUrl || ""}
                onChange={(e) => handleEditChange("previewUrl", e.target.value)}
                placeholder="Введите URL превью"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Функции</Label>
              <div className="space-y-2">
                {editingItem?.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(editingItem.features || [])];
                        newFeatures[index] = e.target.value;
                        handleEditChange("features", newFeatures);
                      }}
                      placeholder={`Функция ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newFeatures = [...(editingItem.features || [])];
                        newFeatures.splice(index, 1);
                        handleEditChange("features", newFeatures);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFeatures = [...(editingItem.features || []), ""];
                    handleEditChange("features", newFeatures);
                  }}
                >
                  Добавить функцию
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Детали</Label>
              <div className="space-y-4 border p-3 rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="overview">Обзор</Label>
                  <Textarea
                    id="overview"
                    value={editingItem?.details?.overview || ""}
                    onChange={(e) => {
                      const newDetails = { ...(editingItem.details || {}) };
                      newDetails.overview = e.target.value;
                      handleEditChange("details", newDetails);
                    }}
                    placeholder="Введите обзор"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Возможности</Label>
                  <div className="space-y-2">
                    {editingItem?.details?.capabilities?.map((capability: any, index: number) => (
                      <div key={index} className="space-y-2 border p-2 rounded-md">
                        <div className="flex gap-2 items-center">
                          <Input
                            value={capability.title}
                            onChange={(e) => {
                              const newCapabilities = [...(editingItem.details.capabilities || [])];
                              newCapabilities[index] = { ...newCapabilities[index], title: e.target.value };
                              const newDetails = { ...(editingItem.details || {}) };
                              newDetails.capabilities = newCapabilities;
                              handleEditChange("details", newDetails);
                            }}
                            placeholder="Название возможности"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newCapabilities = [...(editingItem.details.capabilities || [])];
                              newCapabilities.splice(index, 1);
                              const newDetails = { ...(editingItem.details || {}) };
                              newDetails.capabilities = newCapabilities;
                              handleEditChange("details", newDetails);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={capability.description}
                          onChange={(e) => {
                            const newCapabilities = [...(editingItem.details.capabilities || [])];
                            newCapabilities[index] = { ...newCapabilities[index], description: e.target.value };
                            const newDetails = { ...(editingItem.details || {}) };
                            newDetails.capabilities = newCapabilities;
                            handleEditChange("details", newDetails);
                          }}
                          placeholder="Описание возможности"
                          rows={2}
                        />
                        <Input
                          value={capability.icon || ""}
                          onChange={(e) => {
                            const newCapabilities = [...(editingItem.details.capabilities || [])];
                            newCapabilities[index] = { ...newCapabilities[index], icon: e.target.value };
                            const newDetails = { ...(editingItem.details || {}) };
                            newDetails.capabilities = newCapabilities;
                            handleEditChange("details", newDetails);
                          }}
                          placeholder="URL иконки (необязательно)"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newCapabilities = [
                          ...(editingItem.details?.capabilities || []),
                          { title: "", description: "", icon: "" }
                        ];
                        const newDetails = { ...(editingItem.details || {}) };
                        newDetails.capabilities = newCapabilities;
                        handleEditChange("details", newDetails);
                      }}
                    >
                      Добавить возможность
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Требования</Label>
                  <div className="space-y-2">
                    {editingItem?.details?.requirements?.map((requirement: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={requirement}
                          onChange={(e) => {
                            const newRequirements = [...(editingItem.details.requirements || [])];
                            newRequirements[index] = e.target.value;
                            const newDetails = { ...(editingItem.details || {}) };
                            newDetails.requirements = newRequirements;
                            handleEditChange("details", newDetails);
                          }}
                          placeholder={`Требование ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newRequirements = [...(editingItem.details.requirements || [])];
                            newRequirements.splice(index, 1);
                            const newDetails = { ...(editingItem.details || {}) };
                            newDetails.requirements = newRequirements;
                            handleEditChange("details", newDetails);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newRequirements = [...(editingItem.details?.requirements || []), ""];
                        const newDetails = { ...(editingItem.details || {}) };
                        newDetails.requirements = newRequirements;
                        handleEditChange("details", newDetails);
                      }}
                    >
                      Добавить требование
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Варианты использования</Label>
                  <div className="space-y-2">
                    {editingItem?.details?.useCases?.map((useCase: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={useCase}
                          onChange={(e) => {
                            const newUseCases = [...(editingItem.details.useCases || [])];
                            newUseCases[index] = e.target.value;
                            const newDetails = { ...(editingItem.details || {}) };
                            newDetails.useCases = newUseCases;
                            handleEditChange("details", newDetails);
                          }}
                          placeholder={`Вариант использования ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newUseCases = [...(editingItem.details.useCases || [])];
                            newUseCases.splice(index, 1);
                            const newDetails = { ...(editingItem.details || {}) };
                            newDetails.useCases = newUseCases;
                            handleEditChange("details", newDetails);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newUseCases = [...(editingItem.details?.useCases || []), ""];
                        const newDetails = { ...(editingItem.details || {}) };
                        newDetails.useCases = newUseCases;
                        handleEditChange("details", newDetails);
                      }}
                    >
                      Добавить вариант использования
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={editingItem?.status === "active"}
                onCheckedChange={(checked) => handleEditChange("status", checked ? "active" : "inactive")}
              />
              <Label htmlFor="status">Активен</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveItem}>
              {editingItem?._id ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
