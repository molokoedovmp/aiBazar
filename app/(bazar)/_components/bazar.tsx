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
import { Heart, Star } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    <Card className="overflow-hidden flex flex-col h-full">
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <CardContent className="p-4 flex-grow flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4 flex-grow" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
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
      await toggleFavorite({ itemId: tool._id, itemType: "aiTool" })
    }

    return (
      <Card className="overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-grow">
          <img
            src={tool.coverImage || "/default.png?width=256?height=192&width=256"}
            alt={tool.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{tool.rating?.toFixed(1) ?? 'N/A'}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full space-x-2">
            <Button className="w-full" asChild size="sm">
              <Link href={`https://t.me/aiBazar1`}>Купить</Link>
            </Button>
            <Button className="w-full" asChild size="sm" variant="outline">
              <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer">
                Смотреть
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleFavorite}
              className={isFavorite ? "text-red-500" : ""}
            >
              <Heart className={isFavorite ? "fill-current" : ""} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
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
              const displayTools = toolsInCategory.slice(0, 5)
              
              return (
                <div key={category._id} className="mb-10">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    {toolsInCategory.length > 5 && (
                      <Button 
                        variant="link" 
                        onClick={() => router.push(`/category/${category._id}`)}
                      >
                        Смотреть всё
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
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