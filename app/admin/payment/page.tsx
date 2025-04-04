"use client";

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Edit, Trash, Eye } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Badge } from "@/components/ui/badge"
import { 
  Loader2,
  Download,
  FileJson
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from "react"

// Добавьте интерфейс для типа заказа инструмента
interface ToolOrder {
  _id: string;
  serviceName?: string;
  serviceId: string;
  amount: number;
  status: string;
  contactInfo?: string;
  details?: string;
  userId: string;
  createdAt: string;
  _creationTime: number;
}

// Компонент таблицы заказов
function OrdersTable({ orders, onView, onDelete, onSort }: any) {
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  // Функция для определения статуса заказа
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Выполнен</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">В обработке</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Отменен</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium w-[180px]">ID заказа</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Инструмент</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[120px]">Сумма</th>
            <th className="h-12 px-4 text-left align-middle font-medium w-[150px]">Статус</th>
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
          {orders?.map((order: any) => (
            <tr key={order._id} className="border-b">
              <td className="p-4 align-middle font-medium">
                <div className="truncate max-w-[160px]">
                  {order._id}
                </div>
              </td>
              <td className="p-4 align-middle">
                <div className="truncate max-w-md">
                  {order.serviceName || "Неизвестный инструмент"}
                </div>
              </td>
              <td className="p-4 align-middle">{order.amount} ₽</td>
              <td className="p-4 align-middle">
                {getStatusBadge(order.status)}
              </td>
              <td className="p-4 align-middle">
                {formatDate(order._creationTime)}
              </td>
              <td className="p-4 align-middle text-right whitespace-nowrap">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onView(order)}
                  className="h-8 w-8 inline-flex"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(order._id)}
                  className="h-8 w-8 inline-flex"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          
          {(!orders || orders.length === 0) && (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Нет заказов
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Компонент сетки заказов
function OrdersGrid({ orders, onView, onDelete }: any) {
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };

  // Функция для определения статуса заказа
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Выполнен</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">В обработке</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Отменен</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders?.map((order: any) => (
        <Card key={order._id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate max-w-[200px]">
                {order.serviceName || "Неизвестный инструмент"}
              </h3>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID заказа:</span>
                <span className="font-medium truncate max-w-[150px]">{order._id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сумма:</span>
                <span className="font-medium">{order.amount} ₽</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span>{formatDate(order._creationTime)}</span>
              </div>
              
              {order.contactInfo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Контактная информация:</span>
                  <span className="truncate max-w-[150px]">{order.contactInfo}</span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 pt-0 flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onView(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(order._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      
      {(!orders || orders.length === 0) && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          Нет заказов
        </div>
      )}
    </div>
  )
}

export default function PaymentPage() {
  // Используем правильные API методы для заказов инструментов
  const orders = useQuery(api.aiToolsOrders.get)
  const deleteOrder = useMutation(api.aiToolsOrders.remove)
  const updateOrderStatus = useMutation(api.aiToolsOrders.updateStatus)
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const openViewDialog = (order: any) => {
    setViewingOrder({...order})
    setIsViewDialogOpen(true)
  }
  
  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder({ id: id as Id<"aiToolsOrders"> })
      toast.success("Заказ успешно удален")
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error)
      toast.error("Ошибка при удалении заказа")
    }
  }
  
  // Функция для экспорта в Excel
  const exportToExcel = () => {
    if (!orders) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = orders.map((order: ToolOrder) => ({
        ID: order._id,
        Инструмент: order.serviceName || "Неизвестный инструмент",
        Сумма: order.amount + " ₽",
        Статус: order.status,
        Контактная_информация: order.contactInfo || "-",
        Дата: new Date(order._creationTime).toLocaleString("ru-RU")
      }))
      
      // Создаем рабочую книгу Excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Заказы")
      
      // Сохраняем файл
      XLSX.writeFile(workbook, "orders-export.xlsx")
      
      console.log("Экспорт в Excel выполнен успешно")
    } catch (error) {
      console.error("Ошибка при экспорте в Excel:", error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Функция для экспорта в JSON
  const exportToJSON = () => {
    if (!orders) return
    
    setIsExporting(true)
    
    try {
      // Подготавливаем данные для экспорта
      const data = orders.map((order: ToolOrder) => ({
        id: order._id,
        serviceName: order.serviceName,
        amount: order.amount,
        status: order.status,
        contactInfo: order.contactInfo,
        createdAt: order._creationTime
      }))
      
      // Создаем Blob с данными JSON
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "orders-export.json"
      
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
  
  // Функция для сортировки по дате
  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }
  
  // Фильтрация и сортировка заказов
  const processedOrders = React.useMemo(() => {
    if (!orders) return []
    
    // Сначала фильтруем
    let result = orders.filter((order: ToolOrder) =>
      (order.serviceName && order.serviceName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.contactInfo && order.contactInfo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [orders, searchQuery, sortDirection])
  
  // Функция для обновления статуса заказа
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus({ id: id as Id<"aiToolsOrders">, status })
      toast.success("Статус заказа обновлен")
      
      // Обновляем локальное состояние
      if (viewingOrder && viewingOrder._id === id) {
        setViewingOrder({...viewingOrder, status})
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error)
      toast.error("Ошибка при обновлении статуса")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление заказами инструментов</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel} 
            disabled={isExporting || !orders}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Экспорт в Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToJSON} 
            disabled={isExporting || !orders}
            className="flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
            Экспорт в JSON
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Поиск заказов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Заказы инструментов</CardTitle>
          <CardDescription>
            Управляйте заказами инструментов AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Таблица</TabsTrigger>
              <TabsTrigger value="grid">Сетка</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <OrdersTable 
                orders={processedOrders} 
                onView={openViewDialog} 
                onDelete={handleDeleteOrder}
                onSort={handleSort}
              />
            </TabsContent>
            <TabsContent value="grid">
              <OrdersGrid 
                orders={processedOrders} 
                onView={openViewDialog} 
                onDelete={handleDeleteOrder}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Диалог просмотра заказа */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
            <DialogDescription>
              Подробная информация о заказе
            </DialogDescription>
          </DialogHeader>
          
          {viewingOrder && (
          <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">ID заказа:</div>
                <div className="col-span-2 font-medium break-all">{viewingOrder._id}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Инструмент:</div>
                <div className="col-span-2">{viewingOrder.serviceName || "Неизвестный инструмент"}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Сумма:</div>
                <div className="col-span-2 font-medium">{viewingOrder.amount} ₽</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-muted-foreground">Статус:</div>
                <div className="col-span-2 flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    variant={viewingOrder.status === "completed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(viewingOrder._id, "completed")}
                  >
                    Выполнен
                  </Button>
                  <Button 
                    size="sm"
                    variant={viewingOrder.status === "pending" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(viewingOrder._id, "pending")}
                  >
                    В обработке
                  </Button>
                  <Button 
                    size="sm"
                    variant={viewingOrder.status === "failed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(viewingOrder._id, "failed")}
                  >
                    Отменен
                  </Button>
                </div>
              </div>
              
              {viewingOrder.contactInfo && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-muted-foreground">Контактная информация:</div>
                  <div className="col-span-2 break-all">{viewingOrder.contactInfo}</div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Дата:</div>
                <div className="col-span-2">{formatDistanceToNow(new Date(viewingOrder._creationTime), { addSuffix: true, locale: ru })}</div>
              </div>
          </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Закрыть
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsViewDialogOpen(false);
                handleDeleteOrder(viewingOrder._id);
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
