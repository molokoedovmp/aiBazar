'use client'

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Trash2, ShoppingCart, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

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

export default function FavoritesPage() {
  const favorites = useQuery(api.favorites.getByUser)
  const aiTools = useQuery(api.aiTools.get)
  const toggleFavorite = useMutation(api.favorites.toggleFavorite)

  const favoritedTools = aiTools?.filter(tool => 
    favorites?.some(fav => fav.itemId === tool._id && fav.itemType === "aiTool")
  ) || []

  const handleRemoveFavorite = async (toolId: Id<"aiTools">) => {
    try {
      await toggleFavorite({ itemId: toolId, itemType: "aiTool" })
      toast.success("Инструмент удален из избранного")
    } catch (error) {
      toast.error("Не удалось удалить инструмент из избранного")
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : favoritedTools.length === 0 ? (
          <p className="text-muted-foreground text-center text-lg">У вас пока нет избранных инструментов.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritedTools.map((tool) => (
              <Card key={tool._id} className="bg-card/90 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:scale-[1.02] hover:bg-card">
                <div className="relative">
                  <img
                    src={tool.coverImage || "/default.png?height=128&width=256"}
                    alt={tool.name}
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFavorite(tool._id)}
                    className={`absolute top-2 right-2 hover:bg-transparent text-destructive hover:text-destructive/90 shadow-sm backdrop-blur-[2px] rounded-full p-1.5 transition-colors duration-200`}
                  >
                    <Trash2 className="w-5 h-5 stroke-[2px]" />
                    <span className="sr-only">Удалить из избранного</span>
                  </Button>
                </div>
                <CardContent className="p-3 flex flex-col flex-grow bg-background/40">
                  <h3 className="text-base font-semibold mb-1 text-foreground line-clamp-1">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground/90 mb-2 line-clamp-2 flex-grow">{tool.description}</p>
                  <div className="flex items-center mt-auto">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs text-foreground/80">{tool.rating?.toFixed(1) ?? 'N/A'}</span>
                    <span className="ml-auto text-xs font-semibold text-primary/90">
                      {tool.price === undefined || tool.price === 0 ? 'Бесплатно' : `от ${tool.price.toLocaleString('ru-RU')} ₽`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 grid grid-cols-2 gap-2 bg-background/40">
                  <Button className="w-full text-xs py-1 bg-primary/90 hover:bg-primary" asChild>
                    <Link href={`/payment`} className="flex items-center justify-center h-8">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      <span className="font-medium">Купить</span>
                    </Link>
                  </Button>
                  <Button className="w-full text-xs py-1 bg-secondary/90 hover:bg-secondary" variant="outline" asChild>
                    <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-8">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <span className="font-medium">Смотреть</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}