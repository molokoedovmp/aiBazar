"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Rocket, Diamond, Crown, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

const tiers = [
  {
    name: "Стартовый",
    price: "0",
    duration: "месяц",
    description: "Для ознакомления с возможностями",
    features: [
      "10 запросов в месяц",
      "Базовые функции AI",
      "Поддержка по почте",
      "Доступ к сообществу"
    ],
    cta: "Начать бесплатно",
    popular: false,
    icon: Zap
  },
  {
    name: "Профессионал",
    price: "1000",
    duration: "месяц",
    description: "Для профессионалов и команд",
    features: [
      "100 запросов в месяц",
      "Расширенные функции AI",
      "Приоритетная поддержка",
      "Экспорт результатов",
      "Настройка шаблонов"
    ],
    cta: "Начать пробный период",
    popular: true,
    icon: Rocket
  },
  {
    name: "Премиум",
    price: "3000",
    duration: "месяц",
    description: "Для корпоративных клиентов",
    features: [
      "300 запросов в месяц",
      "Персональный менеджер",
      "Кастомные решения AI",
      "Аналитика использования",
      "SLA 99.9%",
      "Обучение команды"
    ],
    cta: "Запросить демо",
    popular: false,
    icon: Diamond
  }
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/bazarius">
            <Button variant="ghost" className="mb-4 pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад 
            </Button>
          </Link>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Badge variant="outline" className="mb-4 py-2 px-4">
          <Crown className="h-4 w-4 mr-2" />
          Гибкие тарифы
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Выберите свой план
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Оптимизируйте свои затраты с помощью гибкой системы подписок
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative h-full group ${tier.popular ? "border-2 border-primary" : ""}`}>
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg text-sm">
                  Самый популярный
                </div>
              )}
              
              <CardHeader className="pb-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-lg ${tier.popular ? "bg-primary/10" : "bg-muted"}`}>
                    <tier.icon className={`h-8 w-8 ${tier.popular ? "text-primary" : "text-foreground"}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">₽{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.duration}</span>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full gap-2" 
                    variant={tier.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {tier.cta}
                    {tier.popular && <Zap className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-muted/50 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Сравнение возможностей</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 font-medium">Функция</div>
          <div className="col-span-1 text-center">Стартовый</div>
          <div className="col-span-1 text-center">Профессионал</div>
          <div className="col-span-1 text-center">Премиум</div>

          {[
            ["Запросов в месяц", "10", "500", "∞"],
            ["Приоритетная поддержка", "✗", "✓", "✓"],
            ["Кастомные решения", "✗", "✗", "✓"],
            ["Аналитика", "Базовая", "Расширенная", "Премиум"],
            ["SLA", "-", "99%", "99.9%"]
          ].map(([feature, ...values], index) => (
            <>
              <div className="col-span-1 py-2 border-b">{feature}</div>
              {values.map((value, i) => (
                <div key={i} className="col-span-1 py-2 border-b text-center">
                  {value}
                </div>
              ))}
            </>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-8">Частые вопросы</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {[
            {
              question: "Могу ли я сменить тариф позже?",
              answer: "Да, вы можете изменить подписку в любой момент через личный кабинет."
            },
            {
              question: "Есть ли пробный период?",
              answer: "Профессиональный тариф включает 14-дневный пробный период."
            },
            {
              question: "Какие методы оплаты вы принимаете?",
              answer: "Мы принимаем все основные кредитные карты и PayPal."
            },
            {
              question: "Можно ли отменить подписку?",
              answer: "Да, вы можете отменить подписку в любой момент без штрафов."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-background rounded-lg border"
            >
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}