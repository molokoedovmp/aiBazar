"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/app/admin/_components/image-upload";
import { Id } from "@/convex/_generated/dataModel";

export default function AIGadgetsPage() {
  const gadgets = useQuery(api.aibazargpt.getAll);
  const createGadget = useMutation(api.aibazargpt.create);
  const updateGadget = useMutation(api.aibazargpt.update);
  const removeGadget = useMutation(api.aibazargpt.remove);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGadget, setEditingGadget] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openEditDialog = (gadget: any = {}) => {
    setEditingGadget({ ...gadget });
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditingGadget({ ...editingGadget, [field]: value });
  };

  const handleSaveGadget = async () => {
    if (!editingGadget.title) {
      toast.error("Название обязательно");
      return;
    }

    try {
      if (editingGadget._id) {
        await updateGadget(editingGadget);
        toast.success("Гаджет обновлен");
      } else {
        await createGadget({ ...editingGadget, createdAt: Date.now(), updatedAt: Date.now() });
        toast.success("Гаджет создан");
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Ошибка при сохранении гаджета");
    }
  };

  const handleDeleteGadget = async (id: string) => {
    try {
      await removeGadget({ id: id as Id<"aibazargpt"> });
      toast.success("Гаджет удален");
    } catch (error) {
      toast.error("Ошибка при удалении гаджета");
    }
  };

  const filteredGadgets = gadgets?.filter((gadget) => gadget.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Управление гаджетами</h1>
        <Button onClick={() => openEditDialog({})}>
          <Plus className="mr-2 h-4 w-4" /> Добавить гаджет
        </Button>
      </div>
      
      <Input placeholder="Поиск гаджетов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="mb-4" />
      
      <Card>
        <CardHeader>
          <CardTitle>Список гаджетов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGadgets?.map((gadget) => (
                <TableRow key={gadget._id}>
                  <TableCell>{gadget.title}</TableCell>
                  <TableCell>{gadget.type}</TableCell>
                  <TableCell>{gadget.price}</TableCell>
                  <TableCell>{gadget.status}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(gadget)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGadget(gadget._id)}>
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
            <DialogTitle>{editingGadget?._id ? "Редактирование гаджета" : "Добавление нового гаджета"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label>Название</Label>
            <Input value={editingGadget?.title || ""} onChange={(e) => handleEditChange("title", e.target.value)} />
            <Label>Описание</Label>
            <Textarea value={editingGadget?.description || ""} onChange={(e) => handleEditChange("description", e.target.value)} />
            <Label>Тип</Label>
            <Input value={editingGadget?.type || ""} onChange={(e) => handleEditChange("type", e.target.value)} />
            <Label>Цена</Label>
            <Input value={editingGadget?.price || ""} onChange={(e) => handleEditChange("price", e.target.value)} />
            <Label>Статус</Label>
            <Input value={editingGadget?.status || ""} onChange={(e) => handleEditChange("status", e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveGadget}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}