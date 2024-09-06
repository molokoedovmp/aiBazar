"use client"

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { useState, useMemo } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Id } from "@/convex/_generated/dataModel"
import { StarIcon, ClockIcon, Sparkles, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
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

  const categoryConvexId = categoryId as unknown as Id<"categories">

  const currentCategory = categories?.find(category => category._id === categoryConvexId)

  const filteredTools = useMemo(() => {
    if (!aiTools) return []

    let filtered = aiTools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (filterType) {
      case "high-rated":
        return filtered.sort((a, b) => {
          const ratingA = a.rating ?? 0
          const ratingB = b.rating ?? 0
          return ratingB - ratingA
        })
      case "new":
        return filtered.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      case "old":
        return filtered.sort((a, b) => (a._creationTime ?? 0) - (b._creationTime ?? 0))
      default:
        return filtered
    }
  }, [aiTools, searchTerm, filterType])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow max-w-sm">
          <input
            type="text"
            placeholder="Искать AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pr-10 border rounded-md w-full"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <StarIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <SelectValue placeholder="Фильтр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="high-rated">С высоким рейтингом</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="old">Старые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h1 className="text-3xl font-bold mb-6">{currentCategory?.name || "Category Name"}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(!categories || !aiTools) ? (
          Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          filteredTools.map((tool) => (
            <Card key={tool._id} className="overflow-hidden flex flex-col">
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
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
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
                    <Link 
                      href={tool.url ?? "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Смотреть
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}