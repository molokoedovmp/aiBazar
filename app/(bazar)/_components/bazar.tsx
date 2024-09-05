"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import MenuBar from "./menubar"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCombobox } from "@/components/category-combobox"

interface Tool {
  _id: string
  name: string
  description: string
  coverImage?: string
  categoryId: string
  url: string
}

interface Category {
  _id: string
  name: string
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

  const toolsToShow = aiTools?.filter(
    (tool) =>
      (!selectedCategory || tool.categoryId === selectedCategory) &&
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card key={tool._id} className="overflow-hidden flex flex-col h-full">
      <CardContent className="p-0 flex-shrink-0">
        <img
          src={tool.coverImage || "/default.png"}
          alt={tool.name}
          className="w-full h-48 object-cover"
        />
      </CardContent>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{tool.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full space-x-2">
          <Button className="w-full" asChild size="sm">
            <Link href={`https://t.me/aiBazar1`}>Купить</Link>
          </Button>
          <Button className="w-full" asChild size="sm" variant="outline">
            <Link href={tool.url} target="_blank" rel="noopener noreferrer">
              Смотреть
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex">
        <MenuBar />
        <main className="flex-1 p-6">
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
                onSelect={(categoryId: string) => setSelectedCategory(categoryId)}
              />
            )}
          </div>

          {!categories || !aiTools ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            isMobile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {toolsToShow.map((tool) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))}
              </div>
            ) : (
              filteredCategories?.map((category) => {
                const toolsInCategory = aiTools?.filter(
                  (tool) =>
                    tool.categoryId === category._id &&
                    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) || []
                
                const displayTools = toolsInCategory.slice(0, 4)
                
                return (
                  <div key={category._id} className="mb-10">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      {toolsInCategory.length > 4 && (
                        <Link href={`/category/${category._id}`} className="text-primary">
                          Смотреть всё
                        </Link>
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
            )
          )}
        </main>
      </div>
    </div>
  )
}