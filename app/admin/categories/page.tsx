"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Edit, 
  Trash, 
  Plus,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

export default function CategoriesPage() {
  const categories = useQuery(api.categories.get)
  const createCategory = useMutation(api.categories.create)
  const updateCategory = useMutation(api.categories.update)
  const deleteCategory = useMutation(api.categories.remove)
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: ""
  })
  
  const openEditDialog = (category: any) => {
    setEditingCategory({...category})
    setIsEditDialogOpen(true)
  }
  
  const openCreateDialog = () => {
    setNewCategory({
      name: "",
      description: "",
      icon: ""
    })
    setIsCreateDialogOpen(true)
  }
  
  const handleEditChange = (field: string, value: any) => {
    setEditingCategory({
      ...editingCategory,
      [field]: value
    })
  }
  
  const handleNewCategoryChange = (field: string, value: any) => {
    setNewCategory({
      ...newCategory,
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
      await updateCategory({
        id: editingCategory._id,
        name: editingCategory.name,
        description: editingCategory.description || "",
        icon: editingCategory.icon || ""
      })
      
      toast.success("Категория обновлена")
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при обновлении категории:", error)
      toast.error("Ошибка при обновлении категории")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error("Название категории обязательно")
      return
    }
    
    setIsLoading(true)
    try {
      await createCategory({
        name: newCategory.name,
        description: newCategory.description || "",
        icon: newCategory.icon || ""
      })
      
      toast.success("Категория создана")
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Ошибка при создании категории:", error)
      toast.error("Ошибка при создании категории")
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
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Управление категориями</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить категорию
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Список категорий</CardTitle>
          <CardDescription>
            Всего категорий: {categories?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Иконка</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>{category.icon || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {(!categories || categories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Нет категорий
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Диалог редактирования категории */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование категории</DialogTitle>
            <DialogDescription>
              Измените информацию о категории
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Название
                </Label>
                <Input
                  id="name"
                  value={editingCategory.name}
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
                  value={editingCategory.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Иконка
                </Label>
                <Input
                  id="icon"
                  value={editingCategory.icon || ""}
                  onChange={(e) => handleEditChange("icon", e.target.value)}
                  className="col-span-3"
                  placeholder="Например: FiHome, FiSettings"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveCategory} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог создания категории */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создание категории</DialogTitle>
            <DialogDescription>
              Добавьте новую категорию
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
                Название
              </Label>
              <Input
                id="new-name"
                value={newCategory.name}
                onChange={(e) => handleNewCategoryChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="new-description"
                value={newCategory.description}
                onChange={(e) => handleNewCategoryChange("description", e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-icon" className="text-right">
                Иконка
              </Label>
              <Input
                id="new-icon"
                value={newCategory.icon}
                onChange={(e) => handleNewCategoryChange("icon", e.target.value)}
                className="col-span-3"
                placeholder="Например: FiHome, FiSettings"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateCategory} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                "Создать"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
