"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Trash2, ShoppingCart, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Poppins } from "next/font/google"
import { PaymentDialog } from "@/components/payment-dialog"
import Image from 'next/image'

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
})

function SkeletonCard() {
  return (
    <Card className="bg-card/90 backdrop-blur-sm border border-primary/20">
      <Skeleton className="h-32 w-full" />
      <CardContent className="p-3 bg-background/40">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-5/6" />
      </CardContent>
      <CardFooter className="p-3 pt-0 bg-background/40">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}

interface Tool {
  _id: Id<"aiTools">
  name: string
  description?: string
  coverImage?: string
  categoryId?: Id<"categories">
  url?: string
  rating?: number
  isActive: boolean
  price?: number
  _creationTime: number
  startPrice?: number
}

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("recent")

  const favorites = useQuery(api.favorites.getByUser)
  const aiTools = useQuery(api.aiTools.get)
  const categories = useQuery(api.categories.get)
  const toggleFavorite = useMutation(api.favorites.toggleFavorite)

  const favoritedTools = aiTools?.filter(tool =>
    favorites?.some(fav => fav.itemId === tool._id && fav.itemType === "aiTool")
  ) || []

  const filteredTools = favoritedTools
    .filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(tool => 
      selectedCategory === "all" || tool.categoryId === selectedCategory
    )
    .filter(tool => {
      if (priceFilter === "free") return !tool.price || tool.price === 0
      if (priceFilter === "paid") return (tool.price || 0) > 0
      return true
    })
    .filter(tool => 
      (tool.rating || 0) >= minRating
    )
    .sort((a, b) => {
      if (sortBy === "recent") return b._creationTime - a._creationTime
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0)
      return (b.price || 0) - (a.price || 0)
    })

  const handleRemoveFavorite = async (toolId: Id<"aiTools">) => {
    try {
      await toggleFavorite({ itemId: toolId, itemType: "aiTool" })
      toast.success("Инструмент удалён из избранного")
    } catch (error) {
      toast.error("Не удалось удалить инструмент из избранного")
    }
  }

  const formatPrice = (price?: number) => {
    if (price === undefined || price === 0) return "Бесплатно"
    return `${price.toLocaleString("ru-RU")} ₽`
  }

  const FavoriteToolCard = ({ tool }: { tool: Tool }) => {
    return (
      <Card className="bg-card/90 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:scale-[1.02] hover:bg-card">
        <div className="relative">
          <Image
            src={tool.coverImage || "/default.png?height=128&width=256"}
            alt={tool.name}
            width={256}
            height={128}
            className="w-full h-32 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveFavorite(tool._id)}
            className="absolute top-2 right-2 hover:bg-transparent text-destructive hover:text-destructive/90 shadow-sm backdrop-blur-[2px] rounded-full p-1.5 transition-colors duration-200"
          >
            <Trash2 className="w-5 h-5 stroke-[2px]" />
            <span className="sr-only">Удалить из избранного</span>
          </Button>
        </div>
        <CardContent className="p-3 flex flex-col flex-grow bg-background/40">
          <h3 className="text-base font-semibold mb-1 text-foreground line-clamp-1">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground/90 mb-2 line-clamp-2 flex-grow">
            {tool.description}
          </p>
          <div className="flex items-center justify-between mt-auto flex-wrap gap-1">
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs text-foreground/80">
                {tool.rating?.toFixed(1) ?? "N/A"}
              </span>
            </div>
            
            <div className="text-xs font-medium">
              {tool.startPrice && tool.startPrice > 0 ? (
                <span className="px-1.5 py-0.5 bg-primary/10 rounded-full">
                  <span className="font-semibold text-primary">{tool.startPrice}$</span>/{formatPrice(tool.price)}
                </span>
              ) : tool.price && tool.price > 0 ? (
                <span className="px-1.5 py-0.5 bg-primary/10 rounded-full">
                  <span className="font-semibold text-primary">{formatPrice(tool.price)}</span>
                </span>
              ) : (
                <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Бесплатно
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 grid grid-cols-1 gap-2 bg-background/40">
          {tool.price && tool.price > 0 ? (
            <>
              <PaymentDialog 
                price={tool.price} 
                title="aitools"
                tool={tool}
              >
                <Button className="w-full text-xs py-1 bg-primary/90 hover:bg-primary">
                  <div className="flex items-center justify-center h-8">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    <span className="font-medium">Купить</span>
                  </div>
                </Button>
              </PaymentDialog>
              <Button className="w-full text-xs py-1 bg-secondary/90 hover:bg-secondary" variant="outline" asChild>
                <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-8">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span className="font-medium">Смотреть</span>
                </Link>
              </Button>
            </>
          ) : (
            <Button className="w-full text-xs py-1 bg-secondary/90 hover:bg-secondary" variant="outline" asChild>
              <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-8">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="font-medium">Смотреть</span>
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${font.className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-1 text-foreground line-clamp-1 ">
            Избранные инструменты
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {favoritedTools.length} {favoritedTools.length % 10 === 1 ? 'инструмент' : 
            favoritedTools.length % 10 >= 2 && favoritedTools.length % 10 <= 4 ? 'инструмента' : 'инструментов'} в коллекции
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Input
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-background/95 backdrop-blur"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-4 items-start">
            <div className="space-y-2">
              <Label className="text-sm">Категория</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Цена</Label>
              <ToggleGroup 
                type="single" 
                value={priceFilter}
                onValueChange={setPriceFilter}
                className="gap-2"
              >
                <ToggleGroupItem value="all" className="px-3 py-1.5">
                  Все
                </ToggleGroupItem>
                <ToggleGroupItem value="free" className="px-3 py-1.5">
                  Бесплатные
                </ToggleGroupItem>
                <ToggleGroupItem value="paid" className="px-3 py-1.5">
                  Платные
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Рейтинг</Label>
              <div className="flex gap-1">
                {[4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    className={cn(
                      "px-2 py-1 rounded-md transition-colors text-sm",
                      minRating >= rating 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 ml-auto">
              <Label className="text-sm">Сортировка</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировать по" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">По дате</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                  <SelectItem value="price_asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price_desc">Цена: по убыванию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {favorites === undefined ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-12"
          >
            <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-xl text-muted-foreground">
              {favoritedTools.length === 0 
                ? "У вас пока нет избранных инструментов"
                : "Ничего не найдено по выбранным фильтрам"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <FavoriteToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}