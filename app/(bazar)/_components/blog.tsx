"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Clock, User, Eye, ArrowRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

function getPreviewText(content?: string) {
  if (!content) return ""
  try {
    const blocks = JSON.parse(content)
    if (Array.isArray(blocks)) {
      const firstParagraph = blocks.find(
        (block) => block.type === "paragraph" && typeof block.props?.text === "string"
      )
      if (firstParagraph) {
        return firstParagraph.props.text.slice(0, 120) + (firstParagraph.props.text.length > 120 ? "..." : "")
      }
    }
  } catch {
    // Если не JSON, просто обрезаем строку
    return content.slice(0, 120) + (content.length > 120 ? "..." : "")
  }
  return ""
}

// Функция для склонения слова "минута"
function pluralizeMinutes(minutes: number) {
  if (typeof minutes !== 'number' || isNaN(minutes)) return '';
  const lastDigit = minutes % 10;
  const lastTwoDigits = minutes % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${minutes} минут`;
  if (lastDigit === 1) return `${minutes} минута`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${minutes} минуты`;
  return `${minutes} минут`;
}

export default function CommunityBlog() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 6
  const documents = useQuery(api.documents.getPublishedDocumentsWithPreview)
  const allReviews = useQuery(api.reviews.get)

  // Считаем средний рейтинг для каждой статьи
  const documentsWithRatings = (documents || [])
    .filter(doc => doc.isPublished)
    .map((doc) => {
      const docReviews = allReviews?.filter((review) => review.documentId === doc._id) || []
      const averageRating =
        docReviews.length > 0
          ? docReviews.reduce((sum, review) => sum + review.rating, 0) / docReviews.length
          : 0
      return { ...doc, averageRating }
    })

  // Находим статью с максимальным рейтингом
  const featuredArticle = documentsWithRatings.reduce((max: any, doc: any) =>
    (max === null || doc.averageRating > max.averageRating) ? doc : max
  , null)

  // Фильтрация
  const filtered = documentsWithRatings.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  
  // Пагинация
  const pageCount = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero + Featured Article Section */}
      <section className="bg-black text-white py-32 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/10 rotate-45 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rotate-12 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/5 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-20 h-20 border-2 border-white/15 -rotate-12 animate-bounce"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
              {Array.from({ length: 400 }, (_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Hero Text */}
            <div className="text-left animate-fade-in md:col-span-2">
              <h1 className="text-6xl md:text-5xl font-black mb-8 tracking-tighter leading-none">
                <span className="block">ОТКРОЙ ДЛЯ СЕБЯ</span>
                <span className="block">МИР AI</span>
                <span className="block">И СОВРЕМЕННЫХ ТЕХНОЛОГИЙ</span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 max-w-4xl opacity-90 leading-relaxed">
                Исследуйте мир искусственного интеллекта через экспертные статьи,<br/>
                <span className="text-lg opacity-70">гайды и практические советы от профессионалов</span>
              </p>
            </div>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="md:col-span-3 w-full flex justify-center">
                <Card className="bg-white text-black border-4 border-white hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] w-full max-w-3xl min-h-[420px] flex flex-col justify-center overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="grid md:grid-cols-2 gap-0 h-full min-h-full">
                      <div className="h-full flex items-stretch justify-stretch p-0 m-0">
                        {featuredArticle.coverImage ? (
                          <img src={featuredArticle.coverImage} alt="cover" className="object-cover w-full h-full" />
                        ) : (
                          <div className="text-8xl font-black text-gray-300 opacity-50">IMG</div>
                        )}
                      </div>
                      <div className="p-10 flex flex-col justify-center h-full">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="bg-black text-white px-4 py-2 rounded-lg text-lg font-bold">
                            {featuredArticle.averageRating?.toFixed(1) || "—"}
                          </span>
                          <span className="text-gray-500 text-base">РЕКОМЕНДУЕМОЕ</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-black mb-6 leading-tight">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                          {featuredArticle.previewText || getPreviewText(featuredArticle.content)}
                        </p>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4 text-gray-500 text-base">
                            <div className="flex items-center gap-1">
                              <User className="w-5 h-5" />
                              <span>{featuredArticle.userId?.slice(0, 8) || "Автор"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-5 h-5" />
                              <span>{featuredArticle.readTime ? pluralizeMinutes(Number(featuredArticle.readTime)) : "—"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-5 h-5" />
                              <span>{featuredArticle.views || "—"}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/preview/${featuredArticle._id}`}>
                          <Button className="bg-black text-white hover:bg-gray-800 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-fit">
                            ЧИТАТЬ СТАТЬЮ
                            <ArrowRight className="w-6 h-6" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="animate-bounce mt-20">
              <div className="flex flex-col items-center">
                <span className="text-sm mb-2 opacity-70">Узнать больше</span>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
                </div>
              </div>
            </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tight">
              {search ? `РЕЗУЛЬТАТЫ ПОИСКА` : "ВСЕ СТАТЬИ"}
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
            {search && (
              <p className="text-gray-600 mt-4">
                Найдено {filtered.length} статей по запросу "{search}"
              </p>
            )}
            {/* Поиск под заголовком */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Поиск статей, тем, авторов..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-16 pr-6 py-6 text-lg border-2 border-black rounded-xl focus:ring-4 focus:ring-black/20 bg-white"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((doc) => (
              <Link key={doc._id} href={`/preview/${doc._id}`}>
                <Card className="border-2 border-black hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white group">
                  <CardContent className="p-0">
                    <div className="bg-gray-100 h-48 flex items-center justify-center border-b-2 border-black">
                      {doc.coverImage ? (
                        <img src={doc.coverImage} alt="cover" className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-4xl font-black text-gray-300 opacity-50">IMG</div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-400 text-xs">
                          {new Date(doc._creationTime).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3 leading-tight group-hover:text-gray-700 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {doc.previewText || getPreviewText(doc.content)}
                      </p>
                      <div className="flex items-center justify-between text-gray-500 text-xs mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{doc.userId ? doc.userId.slice(0, 8) : "Автор"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{doc.readTime ? pluralizeMinutes(Number(doc.readTime)) : "—"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{doc.views || "—"}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-black text-white hover:bg-gray-800 font-bold py-2 rounded-lg transition-all duration-300 transform group-hover:scale-105">
                        ЧИТАТЬ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {/* Пагинация */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          {filtered.length === 0 && search && (
            <div className="text-center py-12">
              <div className="text-6xl font-black text-gray-200 mb-4">404</div>
              <h3 className="text-2xl font-bold text-black mb-2">Статьи не найдены</h3>
              <p className="text-gray-600 mb-6">Попробуйте изменить поисковый запрос</p>
              <Button 
                onClick={() => setSearch("")}
                className="bg-black text-white hover:bg-gray-800 font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                ПОКАЗАТЬ ВСЕ СТАТЬИ
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
            ЕСТЬ ЧЕМ ПОДЕЛИТЬСЯ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Опубликуйте свою статью и поделитесь знаниями с сообществом
          </p>
          <Button
            className="bg-white text-black hover:bg-gray-200 text-lg px-12 py-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowGuide(true)}
          >
            НАПИСАТЬ СТАТЬЮ
          </Button>
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
                    <h3 className="text-xl font-semibold mb-4">2. Создание контента</h3>
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
      </section>
    </div>
  )
}
