"use client"

import { useParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { useState, useMemo } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Id } from "@/convex/_generated/dataModel"
import { Star, Filter, Heart } from 'lucide-react'
import { useAuth } from "@clerk/clerk-react"
import { SignInButton } from "@clerk/clerk-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterType, setFilterType] = useState<string>("all")
  const categories = useQuery(api.categories.get)
  const aiTools = useQuery(api.aiTools.getByCategory, { 
    categoryId: categoryId as unknown as Id<"categories">
  })
  const { isSignedIn } = useAuth()
  const favorites = useQuery(api.favorites.getByUser)
  const toggleFavorite = useMutation(api.favorites.toggleFavorite)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const categoryConvexId = categoryId as unknown as Id<"categories">
  const currentCategory = categories?.find(category => category._id === categoryConvexId)

  const filteredTools = useMemo(() => {
    if (!aiTools) return []

    let filtered = aiTools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (filterType) {
      case "high-rated":
        return filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      case "new":
        return filtered.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      case "old":
        return filtered.sort((a, b) => (a._creationTime ?? 0) - (b._creationTime ?? 0))
      default:
        return filtered
    }
  }, [aiTools, searchTerm, filterType])

  const ToolCard = ({ tool }: { tool: any }) => {
    const isFavorite = favorites?.some(fav => fav.itemId === tool._id && fav.itemType === "aiTool")

    const handleToggleFavorite = async () => {
      if (!isSignedIn) {
        setIsAlertOpen(true)
        return
      }
      await toggleFavorite({ itemId: tool._id, itemType: "aiTool" })
    }

    return (
      <Card key={tool._id} className="overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-grow">
          <img
            src={tool.coverImage || "/default.png?width=256&height=192"}
            alt={tool.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{tool.rating?.toFixed(1) ?? 'N/A'}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full space-x-2">
            <Button className="w-full" asChild size="sm">
              <Link href={`https://t.me/aiBazar1`}>Купить</Link>
            </Button>
            <Button className="w-full" asChild size="sm" variant="outline">
              <Link 
                href={tool.url ?? "#"} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Смотреть
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow max-w-sm">
          <input
            type="text"
            placeholder="Искать AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pr-10 border rounded-md w-full"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Star className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <SelectValue placeholder="Фильтр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="high-rated">С высоким рейтингом</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="old">Старые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h1 className="text-3xl font-bold mb-6">{currentCategory?.name || "Category Name"}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(!categories || !aiTools) ? (
          Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          filteredTools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))
        )}
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Требуется авторизация</AlertDialogTitle>
            <AlertDialogDescription>
              Для добавления инструмента в избранное необходимо войти в систему.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction asChild>
              <SignInButton mode="modal">
                <Button>Войти</Button>
              </SignInButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}