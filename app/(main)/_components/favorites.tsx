"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

const FavoritesPage = () => {
  const favorites = useQuery(api.favorites.getByUser);
  const aiTools = useQuery(api.aiTools.get);
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);

  const favoritedTools = aiTools?.filter(tool => 
    favorites?.some(fav => fav.itemId === tool._id && fav.itemType === "aiTool")
  ) || [];

  const handleRemoveFavorite = async (toolId: Id<"aiTools">) => {
    try {
      await toggleFavorite({ itemId: toolId, itemType: "aiTool" });
      toast.success("Инструмент удален из избранного");
    } catch (error) {
      toast.error("Не удалось удалить инструмент из избранного");
    }
  };

  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <div className="h-full overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Избранные инструменты</h1>
        {favorites === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden w-full max-w-xs mx-auto">
                <Skeleton className="h-36 w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : favoritedTools.length === 0 ? (
          <p className="text-muted-foreground text-center">У вас пока нет избранных инструментов.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoritedTools.map((tool) => (
              <Card key={tool._id} className="overflow-hidden flex flex-col w-full max-w-xs mx-auto">
                <CardContent className="p-0 flex-grow">
                  <img
                    src={tool.coverImage || "/default.png?width=256&height=144"}
                    alt={tool.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-base font-semibold mb-1 line-clamp-1">{tool.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{tool.description}</p>
                  </div>
                </CardContent>
                <div className="px-3 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{tool.rating?.toFixed(1) ?? 'N/A'}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite(tool._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex w-full space-x-2">
                    <Button className="w-full text-xs py-1" asChild size="sm">
                      <Link href={`https://t.me/aiBazar1`}>Купить</Link>
                    </Button>
                    <Button className="w-full text-xs py-1" asChild size="sm" variant="outline">
                      <Link href={tool.url ?? "#"} target="_blank" rel="noopener noreferrer">
                        Смотреть
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;