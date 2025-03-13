"use client";

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Edit, Trash } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"

export default function OrdersPage() {
  const orders = useQuery(api.aiToolsOrders.getByUser)
  const updateStatus = useMutation(api.aiToolsOrders.updateStatus)
  const removeOrder = useMutation(api.aiToolsOrders.remove)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<{ _id: Id<"aiToolsOrders">; status: string } | null>(null)
  const [status, setStatus] = useState("")

  const openEditDialog = (order: { _id: Id<"aiToolsOrders">; status: string }) => {
    setEditingOrder(order)
    setStatus(order.status)
    setIsEditDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!editingOrder) return
    try {
      await updateStatus({ id: editingOrder._id, status })
      toast.success("Статус заказа обновлен")
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error)
      toast.error("Ошибка при обновлении статуса")
    }
  }

  const handleDeleteOrder = async (id: Id<"aiToolsOrders">) => {
    try {
      await removeOrder({ id })
      toast.success("Заказ удален")
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error)
      toast.error("Ошибка при удалении заказа")
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сервис</TableHead>
                <TableHead>Детали</TableHead>
                <TableHead>Контакт</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.serviceName}</TableCell>
                  <TableCell>{order.details}</TableCell>
                  <TableCell>{order.contactInfo}</TableCell>
                  <TableCell>{order.amount} ₽</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(order)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order._id)}>
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
            <DialogTitle>Редактирование статуса заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block text-sm font-medium">Статус</label>
            <Input value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <Button onClick={handleUpdateStatus}>Сохранить</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
