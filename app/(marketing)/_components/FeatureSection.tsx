"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, ShoppingCart, Star } from "lucide-react"

interface Tool {
  _id: string
  name: string
  description: string
  coverImage?: string
  categoryId: string
  url: string
  rating?: number
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

export default function FeaturePage() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const aiTools = useQuery(api.aiTools.get) as Tool[] | undefined

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

  const toolsToShow = aiTools
    ? aiTools
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4)
    : []

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-6">
        {!aiTools ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {toolsToShow.map((tool) => (
                <Card key={tool._id} className="overflow-hidden flex flex-col h-full">
                  <CardContent className="p-0 flex-shrink-0">
                    <img
                      src={tool.coverImage || "/default.png?height=192&width=256"}
                      alt={tool.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardContent>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{tool.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{tool.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">{tool.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex w-full space-x-2">
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
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/bazar"
                className="button-custom"
                prefetch={false}
              >
                Смотреть все
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}