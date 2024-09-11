"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import MenuBar from "./menubar"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCombobox } from "./category-combobox"
import { Heart, Star, ShoppingCart, ExternalLink } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { SignInButton } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react"
import { Poppins } from "next/font/google"
import { toast } from "sonner"

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

interface Tool {
  _id: Id<"aiTools">
  name: string
  description: string
  coverImage?: string
  categoryId: Id<"categories">
  url: string
  rating?: number
}

interface Category {
  _id: Id<"categories">
  name: string
}

interface Favorite {
  _id: Id<"favorites">
  userId: string
  itemId: Id<"aiTools">
  itemType: "aiTool"
}

function SkeletonCard() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
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

  const filteredCategories = categories?.filter((category) =>
    aiTools?.some(
      (tool) =>
        tool.categoryId === category._id &&
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
        <div className="relative">
          <img
            src={tool.coverImage || "/default.png?height=192&width=400"}
            alt={tool.name}
            className="w-full h-48 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 ${isFavorite ? 'text-red-500' : 'text-white'} hover:text-red-400 bg-background/50 backdrop-blur-sm rounded-full`}
          >
            <Heart className={isFavorite ? "fill-current" : ""} />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">{tool.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">{tool.description}</p>
          <div className="flex items-center mt-auto">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm text-muted-foreground">{tool.rating?.toFixed(1) ?? 'N/A'}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
          <Button className="w-full" asChild>
            <Link href={`https://t.me/aiBazar1`} className="flex items-center justify-center h-10">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="font-medium">Купить</span>
            </Link>
          </Button>
          <Button className="w-full" variant="outline" asChild>
            <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10">
              <ExternalLink className="h-4 w-4 mr-2" />
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
            {isMobile && categories && (
              <CategoryCombobox
                categories={filteredCategories?.map((category) => ({
                  value: category._id,
                  label: category.name,
                })) || []}
                onSelect={(categoryId: Id<"categories">) => router.push(`/category/${categoryId}`)}
              />
            )}
          </div>

          {(!categories || !aiTools) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : (
            filteredCategories?.map((category) => {
              const toolsInCategory = aiTools.filter(tool => tool.categoryId === category._id)
              const displayTools = toolsInCategory.slice(0, 4)
              
              return (
                <div key={category._id} className="mb-10">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-primary relative inline-block">
                      {category.name}
                      <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></span>
                    </h2>
                    {toolsInCategory.length > 4 && (
                      <Button 
                        variant="link" 
                        onClick={() => router.push(`/category/${category._id}`)}
                      >
                        Смотреть всё
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
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