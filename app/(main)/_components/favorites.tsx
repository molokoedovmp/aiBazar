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
              <Card key={index} className="bg-card/50 backdrop-blur-sm">
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
            ))}
          </div>
        ) : favoritedTools.length === 0 ? (
          <p className="text-muted-foreground text-center text-lg">У вас пока нет избранных инструментов.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritedTools.map((tool) => (
              <Card key={tool._id} className="bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="relative">
                  <img
                    src={tool.coverImage || "/default.png?height=192&width=400"}
                    alt={tool.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFavorite(tool._id)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/90 bg-background/50 backdrop-blur-sm rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Удалить из избранного</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}