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
import { Star, Filter, Heart, ShoppingCart, ExternalLink } from 'lucide-react'
import { useAuth } from "@clerk/clerk-react"
import { SignInButton } from "@clerk/clerk-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Poppins } from "next/font/google"
import MenuBar from '@/app/(bazar)/_components/menubar'
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

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
})

function SkeletonCard() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-primary/10">
      <Skeleton className="h-32 w-full" />
      <CardContent className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-5/6" />
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Skeleton className="h-8 w-full" />
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
      case "free":
        return filtered.filter(tool => tool.isActive)
      case "paid":
        return filtered.filter(tool => !tool.isActive)
      case "high-rated":
        return filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      case "new":
        return filtered.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
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
      try {
        await toggleFavorite({ itemId: tool._id, itemType: "aiTool" })
        toast.success(isFavorite ? "Удалено из избранного" : "Добавлено в избранное")
      } catch (error) {
        toast.error("Не удалось обновить избранное")
      }
    }

    return (
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
        <div className="relative">
          <img
            src={tool.coverImage || "/default.png?height=128&width=256"}
            alt={tool.name}
            className="w-full h-32 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`absolute top-1 right-1 ${isFavorite ? 'text-red-500' : 'text-white'} hover:text-red-400 bg-background/50 backdrop-blur-sm rounded-full p-1`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
        <CardContent className="p-3 flex flex-col flex-grow">
          <h3 className="text-base font-semibold mb-1 text-card-foreground line-clamp-1">{tool.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-grow">{tool.description}</p>
          <div className="flex items-center mt-auto">
            <Star className="h-3 w-3 text-yellow-500 mr-1" />
            <span className="text-xs text-muted-foreground">{tool.rating?.toFixed(1) ?? 'N/A'}</span>
            <span className="ml-auto text-xs font-semibold">{tool.isActive ? 'Free' : 'Paid'}</span>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 grid grid-cols-2 gap-2">
            <Button className="w-full text-xs py-1" asChild>
              <Link href={`/payment`} className="flex items-center justify-center h-8">
                <ShoppingCart className="h-3 w-3 mr-1" />
                <span className="font-medium">Купить</span>
              </Link>
            </Button>
          <Button className="w-full text-xs py-1" variant="outline" asChild>
            <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-8">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="font-medium">Смотреть</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background ${font.className}`}>
      <div className="flex flex-1 overflow-hidden">
        <MenuBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center space-x-4">
            <div className="relative flex-grow max-w-sm">
              <Input
                type="text"
                placeholder="Искать AI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <SelectValue placeholder="Фильтр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="free">Бесплатные</SelectItem>
                <SelectItem value="paid">Платные</SelectItem>
                <SelectItem value="high-rated">С высоким рейтингом</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <h1 className="text-3xl font-bold mb-6 text-primary">{currentCategory?.name || "Category Name"}</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(!categories || !aiTools) ? (
              Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
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
        </main>
      </div>
    </div>
  )
}