"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Presentation, ArrowRight, Star, Sparkles, Zap, Brain } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import aiSearchImage from '@/public/aibazargpt/aisearch.png'


// Тип для инструмента из БД
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

export default function AiBazarGPTPage() {
  const tools = useQuery(api.aibazargpt.getAll)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Имитация загрузки для плавного появления контента
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Добавим useEffect для проверки наличия изображений
  useEffect(() => {
    const checkImageExists = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch (error) {
        console.error("Ошибка при проверке изображения:", error);
        return false;
      }
    };

    const checkImages = async () => {
      const image1Exists = await checkImageExists('/aibazargpt/aisearch.png');
      const image2Exists = await checkImageExists('/aibazargpt/aisearch-results.png');
      
      if (!image1Exists) {
        console.warn("Изображение не найдено: /aibazargpt/aisearch.png");
      }
      
      if (!image2Exists) {
        console.warn("Изображение не найдено: /aibazargpt/aisearch-results.png");
      }
    };
    
    checkImages();
  }, []);

  // Скелетон для загрузки
  if (!tools || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-16 w-3/4 mx-auto mb-8" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-5/6 mb-12" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Skeleton className="h-[400px] rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
                <Skeleton className="h-10 w-40 mt-4" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
                <Skeleton className="h-10 w-40 mt-4" />
              </div>
              <Skeleton className="h-[400px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Находим сервисы по ID
  const aiSearchService = tools.find(service => service._id === "kh7dqa1656kjz3sfq443akz2ax7bbmcm")
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Bazarius AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Мощные AI-инструменты для решения ваших задач — созданные нами нейросети, 
              которые помогут вам работать эффективнее.
            </p>
          </div>
          
          {/* AI Поиск */}
          {aiSearchService && (
            <div className={cn(
              "mb-24 opacity-0",
              isLoaded && "animate-fade-in opacity-100"
            )}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl order-2 md:order-1">
                  <Image 
                    src={aiSearchImage}
                    alt="AI Поиск"
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-primary/20 backdrop-blur-sm rounded-full">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-white/90 text-sm font-medium">AI Поиск</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 order-1 md:order-2">
                  <h2 className="text-3xl font-bold">AI Поиск</h2>
                  <p className="text-xl text-muted-foreground">
                    Умный поиск нейросетей по запросу и подбор оптимального решения для ваших задач
                  </p>
                  
                  <div className="space-y-4">
                    <p>
                      AI Поиск анализирует ваш запрос и предлагает оптимальные решения из нашего каталога AI-инструментов. 
                      Система учитывает ваши потребности, бюджет и специфику задачи для подбора наиболее подходящих вариантов.
                    </p>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-3 p-1 bg-primary/10 rounded-full mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Экономия времени на поиск подходящих инструментов</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 p-1 bg-primary/10 rounded-full mt-0.5">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <span>Персонализированные рекомендации под ваши задачи</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 p-1 bg-primary/10 rounded-full mt-0.5">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <span>Доступ к проверенным AI-решениям</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/aibazargpt/ai-search">
                      <Button size="lg" className="group">
                        Попробовать сейчас
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Дополнительная информация об AI Поиске */}
          <div className={cn(
            "mb-24 opacity-0",
            isLoaded && "animate-fade-in opacity-100 animation-delay-300"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Как работает AI Поиск</h2>
                <p className="text-xl text-muted-foreground">
                  Интеллектуальная система для быстрого подбора нейросетей под ваши задачи
                </p>
                
                <div className="space-y-4">
                  <p>
                    Просто опишите свою задачу, и AI Поиск проанализирует ваш запрос, определит ключевые потребности и 
                    предложит наиболее подходящие инструменты из нашего каталога. Вы получите персонализированные 
                    рекомендации с описанием возможностей каждого инструмента, его стоимостью и рейтингом.
                  </p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 p-1 bg-primary/10 rounded-full mt-0.5">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <span>Мгновенный анализ вашего запроса</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 p-1 bg-primary/10 rounded-full mt-0.5">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <span>Учет бюджета и специфики задачи</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 p-1 bg-primary/10 rounded-full mt-0.5">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <span>Актуальная информация о ценах и возможностях</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <Link href="/aibazargpt/ai-search">
                    <Button size="lg" className="group">
                      Начать поиск
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src={aiSearchImage}
                  alt="Результаты AI Поиска"
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-primary/20 backdrop-blur-sm rounded-full">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-white/90 text-sm font-medium">Результаты поиска</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Другие сервисы */}
          <div className={cn(
            "opacity-0",
            isLoaded && "animate-fade-in opacity-100 animation-delay-500"
          )}>
            <h2 className="text-3xl font-bold text-center mb-12">Другие сервисы</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool._id !== "kh7dqa1656kjz3sfq443akz2ax7bbmcm")
                .map(tool => (
                  <ServiceCard key={tool._id} service={tool} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Компонент карточки сервиса
function ServiceCard({ service }: { service: AiBazarGPTTool }) {
  // Определяем иконку в зависимости от типа сервиса
  const getIcon = () => {
    switch (service.type) {
      case 'search':
        return <Bot className="h-5 w-5" />;
      case 'presentation':
        return <Presentation className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <Link href={`/aibazargpt/service/${service._id}`} className="block h-full">
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 border border-primary/10 group">
        <div className="relative w-full h-48">
          <Image
            src={service.coverImage || service.icon || "/default.png"}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-primary/20 backdrop-blur-sm rounded-full">
                {getIcon()}
              </div>
              <span className="text-white font-medium">{service.title}</span>
            </div>
            
            <div className="text-white/80 text-sm">
              {service.price === "Бесплатно" ? "Бесплатно" : `${service.price} ₽`}
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex-grow flex flex-col">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {service.description}
          </p>

          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            >
              <span>Подробнее</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

