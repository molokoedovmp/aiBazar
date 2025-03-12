"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Star, ExternalLink, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PaymentDialog } from "@/components/payment-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Tool {
  _id: string
  name: string
  description: string
  coverImage?: string
  categoryId: string
  url: string
  rating?: number
  price?: number
  startPrice?: number
}

function SkeletonFeature() {
  return (
    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 animate-pulse"></div>
    </div>
  )
}

function SkeletonTab() {
  return (
    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export default function FeaturePage() {
  const [activeTab, setActiveTab] = useState(0)
  const aiTools = useQuery(api.aiTools.get) as Tool[] | undefined

  const toolsToShow = aiTools
    ? aiTools
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4)
    : []

  const formatPrice = (price?: number) => {
    if (price === undefined || price === 0) return 'Бесплатно'
    return `${price.toLocaleString('ru-RU')} ₽`
  }

  if (!aiTools || toolsToShow.length === 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <SkeletonFeature />
          <div className="space-y-6">
            {[0, 1, 2, 3].map((index) => (
              <SkeletonTab key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {toolsToShow.map((tool, index) => (
            <motion.div
              key={tool._id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeTab === index ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: activeTab === index ? "block" : "none" }}
            >
              <Image
                src={tool.coverImage || "/default.png"}
                alt={tool.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/70 dark:bg-black/90">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-white dark:text-white">
                    {tool.name}
                  </h3>
                  <div className="flex items-center bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-black dark:text-white mr-1" />
                    <span className="text-black dark:text-white">{tool.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-gray-200 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs text-foreground/80">{tool.rating?.toFixed(1) ?? 'N/A'}</span>
                  </div>
                  
                  <div>
                    {tool.startPrice && tool.startPrice > 0 ? (
                      <span className="text-xs font-medium">
                        Подписка <span className="font-semibold text-primary">{tool.startPrice}$</span>/{formatPrice(tool.price)}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-primary/90">{formatPrice(tool.price)}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  {tool.price && tool.price > 0 ? (
                    <>
                      <PaymentDialog 
                        price={tool.price} 
                        title="aitools"
                        tool={tool}
                      >
                        <Button className="bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200 border border-transparent">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Купить
                        </Button>
                      </PaymentDialog>
                      <Button 
                        variant="outline" 
                        className="bg-white border-gray-300 text-black hover:bg-gray-100 dark:bg-gray-200 dark:border-gray-400 dark:text-black dark:hover:bg-gray-300"
                        asChild
                      >
                        <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Смотреть
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="bg-white border-gray-300 text-black hover:bg-gray-100 dark:bg-gray-200 dark:border-gray-400 dark:text-black dark:hover:bg-gray-300"
                      asChild
                    >
                      <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Смотреть
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {toolsToShow.map((tool, index) => (
            <div
              key={tool._id}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === index
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:border-gray-300 dark:hover:border-gray-700"
              }`}
              onClick={() => setActiveTab(index)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{tool.name}</h3>
                <div className={`flex items-center ${
                  activeTab === index
                    ? "text-white dark:text-black"
                    : "text-black dark:text-white"
                }`}>
                  <Star className="h-4 w-4 mr-1" />
                  <span>{tool.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              <p className={activeTab === index ? "text-gray-200 dark:text-gray-800" : "text-gray-600 dark:text-gray-400"}>
                {tool.description}
              </p>
              <div className="flex justify-end mt-2">
                <span className={`text-sm font-semibold ${
                  activeTab === index
                    ? "text-gray-200 dark:text-gray-800"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {formatPrice(tool.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-12">
        <Link
          href="/bazar"
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-3 rounded-full font-medium transition-all duration-300"
          prefetch={false}
        >
          Смотреть все
        </Link>
      </div>
    </div>
  )
}