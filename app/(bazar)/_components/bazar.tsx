'use client'

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import MenuBar from "./menubar"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Star, ShoppingCart, ExternalLink, Filter } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { SignInButton } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import { Poppins } from "next/font/google"
import { toast } from "sonner"
import { Icon } from '@iconify/react'

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
})

interface Tool {
  _id: Id<"aiTools">
  name: string
  description: string
  coverImage?: string
  categoryId: Id<"categories">
  url: string
  rating?: number
  isActive: boolean
  _creationTime: number
}

interface Category {
  _id: Id<"categories">
  name: string
  icon?: string
}

interface Favorite {
  _id: Id<"favorites">
  userId: string
  itemId: Id<"aiTools">
  itemType: "aiTool"
}

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

export default function Bazar() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const categories = useQuery(api.categories.get) as Category[] | undefined
  const aiTools = useQuery(api.aiTools.get) as Tool[] | undefined
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  
  const { isSignedIn, isLoaded } = useAuth()
  const favorites = useQuery(api.favorites.getByUser) as Favorite[] | undefined
  const toggleFavorite = useMutation(api.favorites.toggleFavorite)

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const filteredTools = useMemo(() => {
    if (!aiTools) return []

    let filtered = aiTools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (filterType) {
      case "free":
        filtered = filtered.filter(tool => tool.isActive)
        break
      case "paid":
        filtered = filtered.filter(tool => !tool.isActive)
        break
      case "high-rated":
        filtered = filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case "new":
        filtered = filtered.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
        break
    }

    return filtered
  }, [aiTools, searchTerm, filterType])

  const filteredCategories = categories?.filter((category) =>
    filteredTools.some(tool => tool.categoryId === category._id)
  )

  const ToolCard = ({ tool }: { tool: Tool }) => {
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
            <Link href={`/payment?toolId=${tool._id}`} className="flex items-center justify-center h-8">
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
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Искать AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
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

          {(!categories || !aiTools) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : (
            filteredCategories?.map((category) => {
              const toolsInCategory = filteredTools.filter(tool => tool.categoryId === category._id)
              const displayTools = toolsInCategory.slice(0, 5)
              
              if (displayTools.length === 0) return null

              return (
                <div key={category._id} className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-primary relative inline-flex items-center">
                      {category.icon && (
                        <Icon icon={category.icon} className="mr-2 h-5 w-5" />
                      )}
                      {category.name}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
                    </h2>
                    {toolsInCategory.length > 5 && (
                      <Button 
                        variant="link" 
                        onClick={() => router.push(`/category/${category._id}`)}
                        className="text-sm"
                      >
                        Смотреть всё
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
                    {displayTools.map((tool) => (
                      <ToolCard key={tool._id} tool={tool} />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </main>
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