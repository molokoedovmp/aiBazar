"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Zap, CreditCard, Shield } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Spinner } from "@/components/spinner"

// Планы подписки
const pricingPlans = [
  // {
  //   id: "basic",
  //   name: "test",
  //   price: 1,
  //   credits: 1,
  //   features: [
  //     "1 кредитов для всех сервисов"
  //   ],
  //   popular: false
  // },
  {
    id: "basic",
    name: "Базовый",
    price: 299,
    credits: 50,
    features: [
      "50 кредитов для всех сервисов",
      "Доступ ко всем инструментам",
      "Базовая поддержка",
      "Действует 30 дней"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Профессиональный",
    price: 799,
    credits: 200,
    features: [
      "200 кредитов для всех сервисов",
      "Приоритетный доступ к новым функциям",
      "Расширенная поддержка",
      "Действует 30 дней"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Корпоративный",
    price: 1999,
    credits: 600,
    features: [
      "600 кредитов для всех сервисов",
      "Персональный менеджер",
      "Премиум поддержка 24/7",
      "Действует 30 дней"
    ],
    popular: false
  }
]

export default function PricingPage() {
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Запрос к Convex для получения информации о лимитах пользователя
  const userCredits = useQuery(
    api.userCredits.getUserCredits, 
    isSignedIn ? { userId: user?.id } : "skip"
  )
  
  // Мутация для добавления кредитов
  const addCredits = useMutation(api.userCredits.addCredits)
  
  // Добавляем мутацию для создания записи о покупке кредитов
  const createCreditPurchase = useMutation(api.creditPurchases.create)
  
  // Обработчик выбора плана
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }
  
  // Обработчик покупки плана
  const handlePurchase = async () => {
    if (!selectedPlan || !isSignedIn) return
    
    const plan = pricingPlans.find(p => p.id === selectedPlan)
    if (!plan) return
    
    setIsProcessing(true)
    
    try {
      // Создаем запись о покупке
      const purchaseId = await createCreditPurchase({
        userId: user!.id,
        amount: plan.credits,
        price: plan.price,
        status: "pending",
        timestamp: Date.now()
      })
      
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          description: `Пакет кредитов "${plan.name}" - ${plan.credits} кредитов`,
          purchaseId,
          userId: user!.id,
          returnUrl: `${window.location.origin}/bazarius/payment-success?purchaseId=${purchaseId}`
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.paymentUrl) {
        // Перенаправляем на страницу оплаты ЮКассы
        window.location.href = data.paymentUrl
      } else {
        throw new Error(data.error || "Failed to create payment")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Ошибка при создании платежа")
      setIsProcessing(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/bazarius">
          <Button variant="ghost" className="mb-4 pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к сервисам
          </Button>
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Пополнение кредитов</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий план для использования всех возможностей Bazarius AI
          </p>
          
          {isSignedIn && userCredits && (
            <div className="mt-4 inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 text-yellow-500 fill-current" />
              <span>Текущий баланс: <strong>{userCredits.remainingCredits}</strong> кредитов</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              } ${plan.popular ? 'md:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                  Популярный выбор
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  <span className="text-2xl font-bold">{plan.credits}</span>
                </CardTitle>
                <CardDescription>кредитов для всех сервисов</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  {plan.price} ₽
                </div>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Выбрано" : "Выбрать"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 flex flex-col items-center">
          <Button 
            size="lg" 
            className="px-8 gap-2"
            disabled={!selectedPlan || isProcessing || !isSignedIn}
          >
            {isProcessing ? (
              <>
                <Spinner />
                Обработка...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Оплатить
              </>
            )}
          </Button>
          
          {!isSignedIn && (
            <p className="mt-4 text-sm text-muted-foreground">
              Для покупки кредитов необходимо авторизоваться
            </p>
          )}
          
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Безопасная оплата через защищенное соединение</span>
          </div>
        </div>
      </div>
    </div>
  )
}