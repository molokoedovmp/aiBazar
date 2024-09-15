'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Calendar, Star } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import Image from "next/image" // Добавлен импорт для компонента Image

const ITEMS_PER_PAGE = 12

interface Document {
  _id: Id<"documents">
  title: string
  _creationTime: number
  coverImage?: string
  averageRating?: number
}

interface Review {
  _id: Id<"reviews">
  documentId: Id<"documents">
  rating: number
}

export default function CommunityBlog() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highestRated" | "lowestRated">("newest")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)

  const documents = useQuery(api.documents.getPublishedDocuments)
  const allReviews = useQuery(api.reviews.get)
  const isLoading = documents === undefined || allReviews === undefined

  const documentsWithRatings = documents?.map(doc => {
    const docReviews = allReviews?.filter(review => review.documentId === doc._id) || []
    const averageRating = docReviews.length > 0
      ? docReviews.reduce((sum, review) => sum + review.rating, 0) / docReviews.length
      : undefined
    return { ...doc, averageRating }
  })

  const filteredDocuments = documentsWithRatings
    ?.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return b._creationTime - a._creationTime
        case "oldest":
          return a._creationTime - b._creationTime
        case "highestRated":
          return ((b.averageRating ?? 0) - (a.averageRating ?? 0))
        case "lowestRated":
          return ((a.averageRating ?? 0) - (b.averageRating ?? 0))
        default:
          return 0
      }
    })

  const totalPages = Math.ceil((filteredDocuments?.length || 0) / ITEMS_PER_PAGE)

  const paginatedDocuments = filteredDocuments?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortOrder])

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Сообщество aiBazar</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Как поделиться своим опытом использования AI?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Image
                src="/comm2.png"
                alt="Community sharing illustration"
                className="rounded-lg shadow-md w-full md:w-1/2 h-auto object-cover" // Изменен размер с md:w-1/3 на md:w-1/2
                width={956}
                height={484}
              />
              <div className="w-full md:w-1/2">
                <p className="mb-4">Как создать пост в сообщёстве?</p>
                <ol className="list-decimal list-inside mb-4">
                  <li>Чтобы начать создавать посты, вам необходимо авторизоваться в своем аккаунте. Вы можете использовать один из нескольких способов авторизации</li>
                  <li>После авторизации вы попадаете в личный кабинет. Это ваша персональная страница, где отображаются ваша активность в сообществе, написанные посты, черновики, а также другие инструменты для взаимодействия с платформой.</li>
                  <li>Найдите и нажмите на кнопку &quot;Создать страницу&quot;. Обычно она находится на видном месте в вашем личном кабинете.</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Создание поста</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <p className="mb-4">Создание поста</p>
                <ol className="list-decimal list-inside mb-4">
                  <li>Теперь, когда вы находитесь в редакторе, вы можете приступить к созданию вашего контента</li>
                  <li>Используйте заголовки, списки, выделение текста курсивом или жирным, а также добавляйте изображения и видео для улучшения восприятия.</li>
                  <li>После того как вы закончили писать и проверять пост, нажмите на кнопку &quot;Опубликовать&quot;.</li>
                  <li>После того как вы опубликовали пост вы можете зайти в сообщество и убедиться что он появился на главной странице.</li>
                </ol>
              </div>
              <Image
                src="/comm1.png"
                alt="Community sharing illustration"
                className="rounded-lg shadow-md w-full md:w-1/2 h-auto object-cover order-1 md:order-2"
                width={956}
                height={484}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Input
              placeholder="Искать пост..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`pr-10 transition-all duration-300 ${
                isSearchFocused ? "shadow-lg" : ""
              }`}
            />
            <Search
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all duration-300 ${
                isSearchFocused ? "text-primary" : ""
              }`}
              size={20}
            />
          </div>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as typeof sortOrder)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highestRated">По рейтингу </SelectItem>
              <SelectItem value="newest">По дате ↑</SelectItem>
              <SelectItem value="oldest">По дате ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + sortOrder + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {isLoading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))
              : paginatedDocuments?.map((doc) => (
                  <BlogCard key={doc._id} doc={doc} />
                ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(index + 1)
                      }}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

function BlogCard({ doc }: { doc: Document }) {
  return (
    <Link href={`/preview/${doc._id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative pt-[56.25%]">
          <Image
            src={doc.coverImage || "/default.png"}
            alt={doc.title}
            className="absolute inset-0 w-full h-full object-cover"
            width={500}
            height={300}
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 flex-grow">{doc.title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(doc._creationTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} />
              <span>{doc.averageRating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pt-[56.25%]">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mt-auto" />
      </CardContent>
    </Card>
  )
}
