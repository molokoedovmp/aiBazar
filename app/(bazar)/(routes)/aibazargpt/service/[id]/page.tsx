'use client'

import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { InfoIcon, Sparkles, Check } from 'lucide-react'

const services = {
  coursework: {
    title: 'AI Курсовая Работа',
    description: 'Интеллектуальный помощник для написания курсовых работ',
    fullDescription: 'Наш AI помощник поможет вам в написании качественной курсовой работы. Система использует передовые алгоритмы обработки текста для анализа материалов, структурирования информации и формирования связного текста.',
    features: [
      'Анализ источников и литературы',
      'Структурирование материала',
      'Формирование текста',
      'Проверка на плагиат'
    ],
    plans: [
      {
        name: 'Базовый',
        price: 1500,
        features: ['До 20 страниц текста', 'Базовое форматирование', '1 правка']
      },
      {
        name: 'Стандарт',
        price: 2500,
        features: ['До 40 страниц текста', 'Расширенное форматирование', '2 правки']
      },
      {
        name: 'Премиум',
        price: 4000,
        features: ['До 60 страниц текста', 'Полное форматирование', 'Неограниченные правки']
      }
    ],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ]
  },
  research: {
    title: 'AI Ассистент',
    description: 'Умный помощник в выборе нейросетей под ваши задачи',
    icon: '/aibazargpt/search.png',
    price: 'от 490 ₽',
    url: 'https://www.ai-bazar.ru/preview/j57f0vz48aps4c2ahh5amk2c4h7agktd',
    features: [
      'Персонализированный подбор нейросетей',
      'Подробные объяснения и рекомендации',
      'Советы по эффективному использованию',
      'Поддержка различных областей применения',
      'Актуальная база данных AI-инструментов',
      'Помощь в сравнении различных решений'
    ],
    fullDescription: `Наш AI Ассистент - это интеллектуальный помощник, который поможет вам найти идеальные нейросети для ваших задач. 
    
    Просто опишите свою задачу на естественном языке, и ассистент проанализирует ваш запрос, учтет ваши потребности и предложит наиболее подходящие AI-инструменты. Вы получите подробное объяснение, почему именно эти инструменты подойдут лучше всего, и как их использовать максимально эффективно.
    
    Ассистент общается в стиле ChatGPT, давая развернутые, понятные ответы и готов ответить на любые уточняющие вопросы.`,
    plans: [
      {
        name: 'Базовый',
        price: 490,
        features: [
          '3 запроса в день',
          'Базовые рекомендации',
          'Доступ к основной базе нейросетей',
          'Текстовые ответы'
        ]
      },
      {
        name: 'Продвинутый',
        price: 990,
        features: [
          'Безлимитные запросы',
          'Расширенные рекомендации',
          'Доступ к premium базе нейросетей',
          'Сравнительный анализ решений',
          'Приоритетная поддержка'
        ]
      },
      {
        name: 'Бизнес',
        price: 4900,
        features: [
          'Все функции Продвинутого тарифа',
          'Персональный AI-консультант',
          'Индивидуальные стратегии внедрения',
          'Консультации по API и интеграции',
          'Поддержка 24/7'
        ]
      }
    ],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ]
  },
  thesis: {
    title: 'AI Дипломная Работа',
    description: 'Помощь в написании и структурировании дипломных работ',
    fullDescription: 'Наш AI ассистент специализируется на помощи в написании дипломных работ. Мы предоставляем комплексную поддержку на всех этапах работы, от формирования структуры до финального оформления.',
    features: [
      'Формирование структуры',
      'Анализ источников',
      'Написание текста',
      'Оформление по ГОСТ'
    ],
    plans: [
      {
        name: 'Стандарт',
        price: 3000,
        features: ['До 50 страниц', 'Базовое оформление', '1 правка']
      },
      {
        name: 'Расширенный',
        price: 5000,
        features: ['До 80 страниц', 'Полное оформление', '2 правки']
      },
      {
        name: 'VIP',
        price: 8000,
        features: ['До 120 страниц', 'Премиум поддержка', 'Неограниченные правки']
      }
    ],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ]
  }
}

export default function ServicePage() {
  const params = useParams()
  const serviceId = params.id as string
  const service = services[serviceId as keyof typeof services]

  if (!service) {
    return <div>Сервис не найден</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {service.description}
          </p>
        </div>

        {/* Основной контент */}
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="description" className="text-base">Описание</TabsTrigger>
              <TabsTrigger value="pricing" className="text-base">Тарифы</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="grid md:grid-cols-2 gap-8">
                {/* О сервисе */}
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl shadow-lg border border-primary/10">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <span className="bg-primary/10 p-2 rounded-lg mr-3">
                        <InfoIcon className="h-5 w-5 text-primary" />
                      </span>
                      О сервисе
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Возможности */}
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl shadow-lg border border-primary/10">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <span className="bg-primary/10 p-2 rounded-lg mr-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </span>
                      Возможности
                    </h3>
                    <ul className="space-y-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-primary/10 p-1.5 rounded-lg mr-3 mt-0.5">
                            <Check className="h-4 w-4 text-primary" />
                          </span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="grid md:grid-cols-3 gap-6">
                {service.plans.map((plan, index) => (
                  <Card 
                    key={index} 
                    className={`flex flex-col border border-primary/10 shadow-lg transition-all duration-300 hover:shadow-xl ${
                      index === 1 ? 'bg-primary/5 scale-105' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-center">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-3xl font-bold text-center text-primary mt-2">
                        {plan.price} ₽
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="bg-primary/10 p-1.5 rounded-lg mr-3 mt-0.5">
                              <Check className="h-3 w-3 text-primary" />
                            </span>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={index === 1 ? "default" : "outline"}
                      >
                        {index === 1 ? 'Рекомендуемый тариф' : 'Выбрать тариф'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

