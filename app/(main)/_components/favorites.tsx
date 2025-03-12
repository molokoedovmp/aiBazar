"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Trash2, ShoppingCart, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
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
  description: string
  coverImage?: string
  categoryId: Id<"categories">
  url?: string
  rating?: number
  isActive: boolean
  price?: number
  _creationTime: number
  startPrice?: number
}

export default function FavoritesPage() {
  const favorites = useQuery(api.favorites.getByUser)
  const aiTools = useQuery(api.aiTools.get)
  const toggleFavorite = useMutation(api.favorites.toggleFavorite)

  // Фильтруем инструменты, которые добавлены в избранное
  const favoritedTools = aiTools?.filter(tool =>
    favorites?.some(fav => fav.itemId === tool._id && fav.itemType === "aiTool")
  ) || []

  const handleRemoveFavorite = async (toolId: Id<"aiTools">) => {
    try {
      await toggleFavorite({ itemId: toolId, itemType: "aiTool" })
      toast.success("Инструмент удалён из избранного")
    } catch (error) {
      toast.error("Не удалось удалить инструмент из избранного")
    }
  }

  // Функция форматирования цены
  const formatPrice = (price?: number) => {
    if (price === undefined || price === 0) return "Бесплатно"
    return `${price.toLocaleString("ru-RU")} ₽`
  }

  // Компонент карточки инструмента в избранном (с удалением)
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
          <div className="flex items-center mt-auto">
            <Star className="h-3 w-3 text-yellow-500 mr-1" />
            <span className="text-xs text-foreground/80">
              {tool.rating?.toFixed(1) ?? "N/A"}
            </span>
            
            <div className="ml-auto">
              {tool.startPrice && tool.startPrice > 0 ? (
                <span className="text-xs font-medium">
                  Подписка <span className="font-semibold text-primary">{tool.startPrice}$</span>/{formatPrice(tool.price)}
                </span>
              ) : (
                <span className="text-xs font-semibold text-primary/90">{formatPrice(tool.price)}</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 grid grid-cols-1 gap-2 bg-background/40">
          {tool.price && tool.price > 0 ? (
            <>
              <PaymentDialog price={tool.price} title="aitools" tool={tool}>
                <Button className="w-full text-xs py-1 bg-primary/90 hover:bg-primary">
                  <div className="flex items-center justify-center h-8">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    <span className="font-medium">Купить</span>
                  </div>
                </Button>
              </PaymentDialog>
              <Button
                className="w-full text-xs py-1 bg-secondary/90 hover:bg-secondary"
                variant="outline"
                asChild
              >
                <Link
                  href={tool.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-8"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span className="font-medium">Смотреть</span>
                </Link>
              </Button>
            </>
          ) : (
            <Button
              className="w-full text-xs py-1 bg-secondary/90 hover:bg-secondary"
              variant="outline"
              asChild
            >
              <Link
                href={tool.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-8"
              >
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
          <h1 className="text-2xl md:text-2xl font-bold text-primary relative inline-block">
            Избранные инструменты
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Ваша персональная коллекция лучших AI инструментов
          </p>
        </div>

        {favorites === undefined ? (
          // При загрузке
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : favoritedTools.length === 0 ? (
          // Если нет избранных
          <p className="text-muted-foreground text-center text-lg">
            У вас пока нет избранных инструментов.
          </p>
        ) : (
          // Если есть избранные инструменты — выводим в адаптивной сетке
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoritedTools.map((tool) => (
              <FavoriteToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
