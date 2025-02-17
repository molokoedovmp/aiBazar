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

const services = [
  {
    id: "research",
    title: "AI Поиск",
    description: "Умный поиск нейросетей по запросу",
    price: "Бесплатно",
    icon: "/aibazargpt/search.png",
    url: "https://www.ai-bazar.ru/preview/j57f0vz48aps4c2ahh5amk2c4h7agktd",
    features: [/* ... */],
  },
  {
    id: "coursework",
    title: "AI Курсовая Работа",
    description: "Интеллектуальный помощник для написания курсовых работ",
    price: 1500,
    icon: "/landing/course.png",
    url: "https://www.ai-bazar.ru/preview/j57etj43t4t6ktwmb84mzct1m17ahg0m",
  },
  {
    id: "thesis",
    title: "AI Дипломная Работа",
    description: "Помощь в написании и структурировании дипломных работ",
    price: 3000,
    icon: "/aibazargpt/diploma.png",
    url: "https://www.ai-bazar.ru/preview/j574tjma2wa2gygktrnvqdqg7x7agxz2",
  },
    
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"lowToHigh" | "highToLow">("lowToHigh")
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)

  const filteredServices = services
    .filter((service) => service.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.price === "Бесплатно") return sortOrder === "lowToHigh" ? -1 : 1
      if (b.price === "Бесплатно") return sortOrder === "lowToHigh" ? 1 : -1
      return sortOrder === "lowToHigh"
        ? (typeof a.price === "number" ? a.price : 0) - (typeof b.price === "number" ? b.price : 0)
        : (typeof b.price === "number" ? b.price : 0) - (typeof a.price === "number" ? a.price : 0)
    })

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок и описание */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">aiBazargpt</h1>
          <p className="text-muted-foreground text-lg">
            Откройте для себя мощные AI-инструменты для учебы и работы. 
            Наши сервисы помогут вам эффективно решать различные задачи с помощью искусственного интеллекта.
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

        <AnimatePresence mode="wait">
          <motion.div
            key={sortOrder + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: (typeof services)[0] }) {
  return (
    <Link href={`/aibazargpt/service/${service.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-card/50 backdrop-blur-sm border border-primary/10">
        <div className="relative w-full h-40 bg-background/50">
          <Image
            src={service.icon || "/placeholder.svg"}
            alt={service.title}
            fill
            className="absolute inset-0 object-contain p-2"
            priority
          />
        </div>
        <CardContent className="p-3 flex flex-col flex-grow">
          <h3 className="text-base font-semibold mb-1 line-clamp-1">{service.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-grow">{service.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span className="text-yellow-600 font-medium">Скоро появится</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={12} />
              <span className="font-semibold text-primary">
                {typeof service.price === "number" ? `${service.price} ₽` : service.price}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <Button 
              className="w-full h-8 text-xs"
              variant="default"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              <span className="font-medium">Подробнее</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

