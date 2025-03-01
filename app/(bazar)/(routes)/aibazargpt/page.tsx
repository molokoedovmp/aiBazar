"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, DollarSign, ShoppingCart, ExternalLink, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"


// Определяем тип для инструмента из БД
type AiBazarGPTTool = {
  _id: Id<"aibazargpt">;
  _creationTime: number;
  title: string;
  description: string;
  icon: string;
  coverImage?: string;
  type: string;
  status: string;
  features: string[];
  previewUrl?: string;
  price: number | "Бесплатно";
  details: {
    overview: string;
    capabilities: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    requirements: string[];
    useCases: string[];
  };
  createdAt: number;
  updatedAt: number;
}

// Компонент скелетона для карточки
function ServiceCardSkeleton() {
  return (
    <div className="h-full">
      <Card className="overflow-hidden h-full flex flex-col bg-card/50 backdrop-blur-sm border border-primary/10">
        <div className="relative w-full aspect-[16/9] bg-muted">
          <Skeleton className="h-full w-full" />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-center mt-3">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"lowToHigh" | "highToLow">("lowToHigh")
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)

  const tools = useQuery(api.aibazargpt.getAll)

  // Отображаем скелетон, пока данные загружаются
  if (!tools) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Заголовок и описание */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Bazargpt</h1>
            <p className="text-muted-foreground text-lg">
              Откройте для себя мощные AI-инструменты для учебы и работы. 
              Наши сервисы помогут вам эффективно решать различные задачи с помощью искусственного интеллекта.
            </p>
          </div>

          {/* Поиск и фильтры */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 max-w-4xl mx-auto">
            <Skeleton className="h-10 w-full md:w-96" />
            <Skeleton className="h-10 w-[180px] shrink-0" />
          </div>

          {/* Скелетон карточек */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredServices = tools
    ?.filter((tool) => tool.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.price === "Бесплатно") return sortOrder === "lowToHigh" ? -1 : 1;
      if (b.price === "Бесплатно") return sortOrder === "lowToHigh" ? 1 : -1;

      return sortOrder === "lowToHigh"
        ? (typeof a.price === "number" ? a.price : 0) - (typeof b.price === "number" ? b.price : 0)
        : (typeof b.price === "number" ? b.price : 0) - (typeof a.price === "number" ? a.price : 0);
    })

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок и описание */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Bazarius</h1>
          <p className="text-muted-foreground text-lg">
            Откройте для себя мощные AI-инструменты собственного производства — нейросеть Bazarius. 
            Наши сервисы помогут вам эффективно решать различные задачи с помощью искусственного интеллекта, 
            обеспечивая уникальный подход к обучению и работе.
          </p>
        </div>

        {/* Центрированные элементы поиска и фильтрации */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative w-full md:w-96">
            <Input
              placeholder="Искать..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`pr-10 transition-all duration-300 ${isSearchFocused ? "shadow-lg" : ""}`}
            />
            <Search
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all duration-300 ${
                isSearchFocused ? "text-primary" : ""
              }`}
              size={20}
            />
          </div>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as typeof sortOrder)}>
            <SelectTrigger className="w-[180px] shrink-0">
              <SelectValue placeholder="Цена: по..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowToHigh">Цена: по возрастанию</SelectItem>
              <SelectItem value="highToLow">Цена: по убыванию</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Обновляем компонент ServiceCard
function ServiceCard({ service }: { service: AiBazarGPTTool }) {
  return (
    <Link href={`/aibazargpt/service/${service._id}`} className="block h-full">
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border border-primary/10 group">
        {/* Контейнер изображения фиксированной высоты */}
        <div className="relative w-full h-48 bg-background/50">
          <Image
            src={service.icon || "/default.png"}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        <CardContent className="p-6 flex flex-col flex-grow">
          {/* Заголовок */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{service.title}</h3>
          
          {/* Описание */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {service.description}
          </p>

          {/* Цена */}
          <div className="text-lg font-semibold mb-4">
            {service.price === "Бесплатно" ? "Бесплатно" : `${service.price} ₽`}
          </div>
          
          {/* Статус */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <span className={service.status === "coming_soon" ? "text-yellow-600" : "text-green-600"}>
                {service.status === "coming_soon" ? "Скоро появится" : "Доступно"}
              </span>
            </div>
          </div>

          {/* Кнопка */}
          <Button 
            className="w-full"
            variant="default"
          >
            <span className="font-medium">Подробнее</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

