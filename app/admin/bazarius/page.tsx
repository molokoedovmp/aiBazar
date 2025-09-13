"use client";

import { useState, useMemo } from "react"
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
  status: string;
  details: {};
}

function BazariusTable({ items, onEdit, onDelete, onSort }: any) {
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

function BazariusGrid({ items, onEdit, onDelete }: any) {
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
  const bazariusItems = useQuery(api.creditPurchases.list)
  const createItem = useMutation(api.creditPurchases.create)
  const updateItem = useMutation(api.creditPurchases.update)
  const removeItem = useMutation(api.creditPurchases.remove)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const openEditDialog = (item?: any) => {
    if (item) {
      setEditingItem({ ...item })
      setIsCreating(false)
    } else {
      setEditingItem({
        userId: "",
        amount: 0,
        price: 0,
        status: "pending",
        paymentId: "",
        timestamp: Date.now()
      })
      setIsCreating(true)
    }
    setIsEditDialogOpen(true)
  }

  const handleEditChange = (field: string, value: any) => {
    setEditingItem({
      ...editingItem,
      [field]: value
    })
  }

  const handleSaveItem = async () => {
    try {
      setIsUpdating(true)
      if (editingItem._id) {
        await updateItem({
          id: editingItem._id as Id<"creditPurchases">,
          userId: editingItem.userId,
          amount: Number(editingItem.amount),
          price: Number(editingItem.price),
          status: editingItem.status,
          paymentId: editingItem.paymentId || undefined,
          timestamp: editingItem.timestamp || Date.now()
        })
        toast.success("Элемент успешно обновлен")
      } else {
        await createItem({
          userId: editingItem.userId,
          amount: Number(editingItem.amount),
          price: Number(editingItem.price),
          status: editingItem.status,
          paymentId: editingItem.paymentId || undefined,
          timestamp: Date.now()
        })
        toast.success("Элемент успешно создан")
      }
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при сохранении элемента:", error)
      toast.error("Ошибка при сохранении элемента")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот элемент?")) {
      try {
        await removeItem({ id: id as Id<"creditPurchases"> })
        toast.success("Элемент успешно удален")
      } catch (error) {
        console.error("Ошибка при удалении элемента:", error)
        toast.error("Ошибка при удалении элемента")
      }
    }
  }

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  const handleExportExcel = async () => {
    try {
      setIsExporting(true)
      const data = (bazariusItems || []).map((item) => ({
        ID: item._id,
        Пользователь: item.userId,
        Количество_кредитов: item.amount,
        Цена: item.price, // без валюты — удобнее для Excel-обработки
        Статус: item.status,
        ID_платежа: item.paymentId || 'Нет',
        Дата_создания_ISO: new Date(item._creationTime).toISOString(),
        Дата_создания_локально: new Date(item._creationTime).toLocaleString("ru-RU")
      }))

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases")
      XLSX.writeFile(workbook, `bazarius_purchases_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`)
      toast.success("Данные экспортированы в Excel")
    } catch (error) {
      console.error("Ошибка при экспорте данных:", error)
      toast.error("Ошибка при экспорте данных")
    } finally {
      setIsExporting(false)
    }
  }

  // ✅ Полный JSON-экспорт для миграции в другие БД
  const handleExportJSON = async () => {
    try {
      setIsExporting(true)

      // Берём все поля документа как есть + добавляем удобные дубликаты
      const records = (bazariusItems || []).map((item: any) => {
        const { _id, _creationTime, ...rest } = item
        return {
          // служебные поля Convex
          _id,                         // исходный Convex Id<"creditPurchases">
          id: _id,                     // дубликат поля для совместимости с импортерами
          _creationTime,               // миллисекунды UNIX
          createdAt: new Date(_creationTime).toISOString(), // ISO-строка для удобства
          // всё остальное как есть (userId, amount, price, status, paymentId, timestamp, и т.д.)
          ...rest,
        }
      })

      const payload = {
        export: "creditPurchases",
        exportedAt: new Date().toISOString(),
        count: records.length,
        records
      }

      const jsonString = JSON.stringify(payload, null, 2)
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `creditPurchases_full_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("JSON для миграции успешно сохранён")
    } catch (error) {
      console.error("Ошибка при экспорте JSON:", error)
      toast.error("Ошибка при экспорте JSON")
    } finally {
      setIsExporting(false)
    }
  }

  const filteredItems = useMemo(() => {
    if (!bazariusItems) return []

    let result = bazariusItems.filter((item) =>
      item.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.paymentId && item.paymentId.toLowerCase().includes(searchQuery.toLowerCase()))
    )

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
            onClick={handleExportExcel}
            disabled={isExporting || !bazariusItems}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Экспорт в Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportJSON}
            disabled={isExporting || !bazariusItems}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
            JSON для миграции
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
                items={filteredItems}
                onEdit={openEditDialog}
                onDelete={handleDeleteItem}
                onSort={handleSort}
              />
            </TabsContent>
            <TabsContent value="grid">
              <BazariusGrid
                items={filteredItems}
                onEdit={openEditDialog}
                onDelete={handleDeleteItem}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
              <Label htmlFor="userId">ID пользователя</Label>
              <Input
                id="userId"
                value={editingItem?.userId || ""}
                onChange={(e) => handleEditChange("userId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Количество кредитов</Label>
              <Input
                id="amount"
                type="number"
                value={editingItem?.amount || 0}
                onChange={(e) => handleEditChange("amount", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Цена</Label>
              <Input
                id="price"
                type="number"
                value={editingItem?.price || 0}
                onChange={(e) => handleEditChange("price", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={editingItem?.status || "pending"}
                onValueChange={(value) => handleEditChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">В ожидании</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="failed">Ошибка</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentId">ID платежа</Label>
              <Input
                id="paymentId"
                value={editingItem?.paymentId || ""}
                onChange={(e) => handleEditChange("paymentId", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveItem}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
