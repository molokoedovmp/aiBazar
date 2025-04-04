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

// Интерфейс для типа гаджета
interface Gadget {
  _id: string;
  _creationTime: number;
  name: string;
  description: string;
  price: number;
  coverImage?: string;
  features: string[];
  status: string; // "available" | "coming_soon" | "sold_out"
  category: string; // "smart_home" | "wearables" | "robots" | "other"
  specifications?: {
    dimensions?: string;
    weight?: string;
    battery?: string;
    connectivity?: string;
  };
  createdAt: number;
}

// Компонент таблицы гаджетов
function GadgetsTable({ items, onEdit, onDelete, onSort }: any) {
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  // Функция для определения статуса гаджета
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Доступен</Badge>;
      case "coming_soon":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Скоро в продаже</Badge>;
      case "sold_out":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Распродан</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium">Название</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-1/3">Описание</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[120px]">Цена</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[120px]">Категория</th>
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
          {items?.map((item: Gadget) => (
            <tr key={item._id} className="border-b">
              <td className="p-4 align-middle font-medium">
                <div className="truncate max-w-[200px]">
                  {item.name}
                </div>
              </td>
              <td className="p-4 align-middle">
                <div className="truncate max-w-md">
                  {item.description}
                </div>
              </td>
              <td className="p-4 align-middle">{item.price} ₽</td>
              <td className="p-4 align-middle">
                {item.category === "smart_home" && "Умный дом"}
                {item.category === "wearables" && "Носимые устройства"}
                {item.category === "robots" && "Роботы"}
                {item.category === "other" && "Другое"}
              </td>
              <td className="p-4 align-middle">
                {getStatusBadge(item.status)}
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
              <td colSpan={7} className="text-center py-4">
                Нет гаджетов
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Компонент сетки гаджетов
function GadgetsGrid({ items, onEdit, onDelete }: any) {
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  // Функция для определения статуса гаджета
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Доступен</Badge>;
      case "coming_soon":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Скоро в продаже</Badge>;
      case "sold_out":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Распродан</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items?.map((item: Gadget) => (
        <Card key={item._id} className="overflow-hidden">
          {item.coverImage && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={item.coverImage} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate max-w-[200px]">
                {item.name}
              </h3>
              {getStatusBadge(item.status)}
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
                <span className="text-muted-foreground">Категория:</span>
                <span>
                  {item.category === "smart_home" && "Умный дом"}
                  {item.category === "wearables" && "Носимые устройства"}
                  {item.category === "robots" && "Роботы"}
                  {item.category === "other" && "Другое"}
                </span>
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
          Нет гаджетов
        </div>
      )}
    </div>
  )
}

export default function GadgetsPage() {
  // Запросы к API - исправляем названия методов
  const gadgets = useQuery(api.aiGadgets.get)
  const createGadget = useMutation(api.aiGadgets.addGadget)
  const updateGadget = useMutation(api.aiGadgets.updateGadget)
  const removeGadget = useMutation(api.aiGadgets.removeGadget)
  
  // Состояния
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingGadget, setEditingGadget] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isExporting, setIsExporting] = useState(false)
  
  // Функция для открытия диалога редактирования
  const openEditDialog = (item?: any) => {
    if (item) {
      setEditingGadget({...item})
    } else {
      setEditingGadget({
        name: "",
        description: "",
        price: 0,
        coverImage: "",
        features: [],
        status: "available",
        category: "smart_home",
        specifications: {
          dimensions: "",
          weight: "",
          battery: "",
          connectivity: ""
        }
      })
    }
    setIsEditDialogOpen(true)
  }
  
  // Функция для обработки изменений в форме редактирования
  const handleEditChange = (field: string, value: any) => {
    setEditingGadget({
      ...editingGadget,
      [field]: value
    })
  }
  
  // Функция для сохранения гаджета
  const handleSaveGadget = async () => {
    try {
      if (editingGadget._id) {
        // Обновление существующего гаджета
        await updateGadget({
          id: editingGadget._id as Id<"aiGadgets">,
          name: editingGadget.name,
          description: editingGadget.description,
          price: editingGadget.price,
          coverImage: editingGadget.coverImage,
          features: editingGadget.features,
          status: editingGadget.status,
          category: editingGadget.category,
          specifications: editingGadget.specifications
        })
        toast.success("Гаджет успешно обновлен")
      } else {
        // Создание нового гаджета
        await createGadget({
          name: editingGadget.name,
          description: editingGadget.description,
          price: editingGadget.price,
          coverImage: editingGadget.coverImage,
          features: editingGadget.features,
          status: editingGadget.status,
          category: editingGadget.category,
          specifications: editingGadget.specifications
        })
        toast.success("Гаджет успешно создан")
      }
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при сохранении гаджета:", error)
      toast.error("Ошибка при сохранении гаджета")
    }
  }
  
  // Функция для удаления гаджета
  const handleDeleteGadget = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот гаджет?")) {
      try {
        await removeGadget({ id: id as Id<"aiGadgets"> })
        toast.success("Гаджет успешно удален")
      } catch (error) {
        console.error("Ошибка при удалении гаджета:", error)
        toast.error("Ошибка при удалении гаджета")
      }
    }
  }
  
  // Функция для экспорта в Excel
  const exportToExcel = async () => {
    if (!gadgets) return
    
    setIsExporting(true)
    try {
      const data = gadgets.map((item: Gadget) => ({
        ID: item._id,
        Название: item.name,
        Описание: item.description,
        Цена: item.price + " ₽",
        Категория: item.category === "smart_home" ? "Умный дом" : 
                  item.category === "wearables" ? "Носимые устройства" : 
                  item.category === "robots" ? "Роботы" : "Другое",
        Статус: item.status === "available" ? "Доступен" : 
               item.status === "coming_soon" ? "Скоро в продаже" : 
               item.status === "sold_out" ? "Распродан" : item.status,
        Дата_создания: new Date(item._creationTime).toLocaleString("ru-RU")
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Гаджеты")
      
      XLSX.writeFile(workbook, "gadgets_export.xlsx")
      toast.success("Экспорт в Excel выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в Excel:", error)
      toast.error("Ошибка при экспорте в Excel")
    } finally {
      setIsExporting(false)
    }
  }
  
  // Функция для экспорта в JSON
  const exportToJSON = async () => {
    if (!gadgets) return
    
    setIsExporting(true)
    try {
      const data = gadgets.map((item: Gadget) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        coverImage: item.coverImage,
        features: item.features,
        status: item.status,
        category: item.category,
        specifications: item.specifications,
        createdAt: item._creationTime
      }))
      
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement("a")
      a.href = url
      a.download = "gadgets_export.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("Экспорт в JSON выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в JSON:", error)
      toast.error("Ошибка при экспорте в JSON")
    } finally {
      setIsExporting(false)
    }
  }
  
  // Функция для сортировки по дате
  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }
  
  // Фильтрация и сортировка гаджетов
  const processedGadgets = React.useMemo(() => {
    if (!gadgets) return []
    
    // Сначала фильтруем
    let result = gadgets.filter((gadget: Gadget) =>
      gadget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gadget.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [gadgets, searchQuery, sortDirection])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление гаджетами</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel} 
            disabled={isExporting || !gadgets}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Экспорт в Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToJSON} 
            disabled={isExporting || !gadgets}
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
          placeholder="Поиск гаджетов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Гаджеты</CardTitle>
          <CardDescription>
            Управляйте AI гаджетами.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Таблица</TabsTrigger>
              <TabsTrigger value="grid">Сетка</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <GadgetsTable 
                items={processedGadgets} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteGadget}
                onSort={handleSort}
              />
            </TabsContent>
            <TabsContent value="grid">
              <GadgetsGrid 
                items={processedGadgets} 
                onEdit={openEditDialog} 
                onDelete={handleDeleteGadget}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Диалог редактирования/создания гаджета */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGadget?._id ? "Редактирование гаджета" : "Создание гаджета"}
            </DialogTitle>
            <DialogDescription>
              {editingGadget?._id 
                ? "Измените информацию о гаджете" 
                : "Добавьте новый гаджет"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={editingGadget?.name || ""}
                onChange={(e) => handleEditChange("name", e.target.value)}
                placeholder="Введите название"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={editingGadget?.description || ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
                placeholder="Введите описание"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                value={editingGadget?.price || 0}
                onChange={(e) => handleEditChange("price", Number(e.target.value))}
                placeholder="Введите цену"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <select
                id="category"
                className="w-full p-2 border rounded-md"
                value={editingGadget?.category || "smart_home"}
                onChange={(e) => handleEditChange("category", e.target.value)}
              >
                <option value="smart_home">Умный дом</option>
                <option value="wearables">Носимые устройства</option>
                <option value="robots">Роботы</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                className="w-full p-2 border rounded-md"
                value={editingGadget?.status || "available"}
                onChange={(e) => handleEditChange("status", e.target.value)}
              >
                <option value="available">Доступен</option>
                <option value="coming_soon">Скоро в продаже</option>
                <option value="sold_out">Распродан</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">URL изображения</Label>
              <Input
                id="coverImage"
                value={editingGadget?.coverImage || ""}
                onChange={(e) => handleEditChange("coverImage", e.target.value)}
                placeholder="Введите URL изображения"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Функции</Label>
              <div className="space-y-2">
                {editingGadget?.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(editingGadget.features || [])];
                        newFeatures[index] = e.target.value;
                        handleEditChange("features", newFeatures);
                      }}
                      placeholder={`Функция ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newFeatures = [...(editingGadget.features || [])];
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
                    const newFeatures = [...(editingGadget.features || []), ""];
                    handleEditChange("features", newFeatures);
                  }}
                >
                  Добавить функцию
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Спецификации</Label>
              <div className="space-y-2 border p-3 rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Размеры</Label>
                  <Input
                    id="dimensions"
                    value={editingGadget?.specifications?.dimensions || ""}
                    onChange={(e) => {
                      const newSpecs = { ...(editingGadget.specifications || {}) };
                      newSpecs.dimensions = e.target.value;
                      handleEditChange("specifications", newSpecs);
                    }}
                    placeholder="Например: 10 x 5 x 2 см"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Вес</Label>
                  <Input
                    id="weight"
                    value={editingGadget?.specifications?.weight || ""}
                    onChange={(e) => {
                      const newSpecs = { ...(editingGadget.specifications || {}) };
                      newSpecs.weight = e.target.value;
                      handleEditChange("specifications", newSpecs);
                    }}
                    placeholder="Например: 200 г"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="battery">Батарея</Label>
                  <Input
                    id="battery"
                    value={editingGadget?.specifications?.battery || ""}
                    onChange={(e) => {
                      const newSpecs = { ...(editingGadget.specifications || {}) };
                      newSpecs.battery = e.target.value;
                      handleEditChange("specifications", newSpecs);
                    }}
                    placeholder="Например: 5000 мАч, до 10 часов работы"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="connectivity">Подключение</Label>
                  <Input
                    id="connectivity"
                    value={editingGadget?.specifications?.connectivity || ""}
                    onChange={(e) => {
                      const newSpecs = { ...(editingGadget.specifications || {}) };
                      newSpecs.connectivity = e.target.value;
                      handleEditChange("specifications", newSpecs);
                    }}
                    placeholder="Например: Wi-Fi, Bluetooth 5.0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveGadget}>
              {editingGadget?._id ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
