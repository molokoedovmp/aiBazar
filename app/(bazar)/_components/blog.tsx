"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

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
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "highestRated" | "lowestRated"
  >("newest")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showGuide, setShowGuide] = useState(false)

  const documents = useQuery(api.documents.getPublishedDocuments)
  const allReviews = useQuery(api.reviews.get)
  const isLoading = documents === undefined || allReviews === undefined

  // Подсчёт среднего рейтинга
  const documentsWithRatings = documents?.map((doc) => {
    const docReviews =
      allReviews?.filter((review) => review.documentId === doc._id) || []
    const averageRating =
      docReviews.length > 0
        ? docReviews.reduce((sum, review) => sum + review.rating, 0) /
          docReviews.length
        : undefined
    return { ...doc, averageRating }
  })

  // Фильтрация и сортировка
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
          return (b.averageRating ?? 0) - (a.averageRating ?? 0)
        case "lowestRated":
          return (a.averageRating ?? 0) - (b.averageRating ?? 0)
        default:
          return 0
      }
    })

  // Пагинация
  const totalPages = Math.ceil((filteredDocuments?.length || 0) / ITEMS_PER_PAGE)
  const paginatedDocuments = filteredDocuments?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // При изменении поиска/сортировки сбрасываем страницу
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortOrder])

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black/95 text-black dark:text-white">
      {/* Hero-секция с фоновым изображением */}
      <div
        className="relative flex flex-col items-center pt-20 pb-12 bg-cover bg-center"
        style={{ backgroundImage: 'url("/gradient.png")' }}
      >
        {/* Полупрозрачная подложка поверх картинки */}
        <div className="absolute inset-0 bg-black/30 -z-10" />

        {/* Заголовок, описание и кнопка */}
        <div className="relative z-10 container px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Сообщество aiBazar
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
            Делитесь опытом, изучайте новые инструменты и становитесь частью
            растущего AI-комьюнити
          </p>
          <Button
            onClick={() => setShowGuide(true)}
            variant="outline"
            className="border border-white/20 bg-white/10
                       hover:bg-white/20 text-white
                       transition-all"
          >
            Как создать пост?
          </Button>
        </div>

        {/* Блок поиска и сортировки */}
        <div className="relative z-10 container px-4 w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="w-full relative">
              {/* Увеличиваем размытие фона и делаем его темнее */}
              <div className="absolute -inset-3 bg-black/40 blur-xl rounded-[20px]" />
              
              <div className="relative flex flex-col sm:flex-row gap-4 p-4 rounded-lg 
                              border border-white/20 
                              backdrop-blur-md
                              bg-black/30
                              hover:border-white/30 
                              transition-all"
              >
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2
                               text-white/60"
                    size={20}
                  />
                  <Input
                    placeholder="Искать пост..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full
                               bg-black/20 border-white/20
                               hover:border-white/30
                               text-white placeholder:text-white/50
                               transition-all
                               focus:border-white/40"
                  />
                </div>
                <Select
                  value={sortOrder}
                  onValueChange={(value) =>
                    setSortOrder(value as typeof sortOrder)
                  }
                >
                  <SelectTrigger
                    className="w-full sm:w-[200px]
                               bg-black/20
                               border-white/20
                               hover:border-white/30
                               text-white
                               transition-all"
                  >
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highestRated">Популярные</SelectItem>
                    <SelectItem value="newest">Новые</SelectItem>
                    <SelectItem value="oldest">Старые</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Сетка постов (без отрицательного отступа) */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + sortOrder + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(p - 1, 1))
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Модальное окно с гайдом */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Как создать пост в сообществе?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/comm2.png"
                  alt="Авторизация"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">1. Подготовка</h3>
                <div className="space-y-3 text-muted-foreground dark:text-gray-400">
                  <p>• Авторизуйтесь в своем аккаунте</p>
                  <p>• Перейдите в личный кабинет</p>
                  <p>• Найдите кнопку "Создать страницу"</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/comm1.png"
                  alt="Создание поста"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">
                  2. Создание контента
                </h3>
                <div className="space-y-3 text-muted-foreground dark:text-gray-400">
                  <p>• Используйте редактор для форматирования текста</p>
                  <p>• Добавляйте изображения и видео</p>
                  <p>• Проверьте пост перед публикацией</p>
                  <p>• Нажмите "Опубликовать"</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BlogCard({ doc }: { doc: Document }) {
  return (
    <Link href={`/preview/${doc._id}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden h-full hover:shadow-xl transition-all bg-card border-border">
          <div className="relative aspect-video">
            <Image
              src={doc.coverImage || "/default.png"}
              alt={doc.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-card-foreground">
              {doc.title}
            </h3>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Calendar size={16} />
                <span>
                  {new Date(doc._creationTime).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-primary/20 text-primary rounded-full px-3 py-1">
                <Star size={16} />
                <span>{doc.averageRating?.toFixed(1) || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
