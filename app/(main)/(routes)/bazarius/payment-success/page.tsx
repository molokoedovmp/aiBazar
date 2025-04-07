"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [checkAttempts, setCheckAttempts] = useState(0)
  
  // Мутация для обновления статуса покупки и добавления кредитов
  const completePurchase = useMutation(api.creditPurchases.completePurchase)
  
  // Получаем параметры из URL
  const paymentId = searchParams.get("payment_id")
  const purchaseId = searchParams.get("purchase_id")
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId || !purchaseId) {
        setIsVerifying(false)
        setIsSuccess(false)
        return
      }
      
      try {
        // Проверяем статус платежа через API
        const response = await fetch(`/api/payments/check?payment_id=${paymentId}`)
        const data = await response.json()
        
        console.log(`Проверка #${checkAttempts + 1}:`, data);
        
        if (data.success && (data.status === "succeeded" || data.paid === true)) {
          // Завершаем покупку только если платеж успешен
          const result = await completePurchase({ purchaseId })
          setIsSuccess(result.success)
          setIsVerifying(false)
          toast.success("Оплата успешно завершена! Кредиты добавлены на ваш счет.")
        } else if (checkAttempts < 10) {
          // Если платеж еще не успешен и не превышено количество попыток,
          // продолжаем проверять через 2 секунды
          setCheckAttempts(prev => prev + 1)
          setTimeout(verifyPayment, 2000)
        } else {
          // Превышено количество попыток
          setIsVerifying(false)
          setIsSuccess(false)
          toast.error("Не удалось подтвердить платеж. Пожалуйста, обратитесь в поддержку.")
        }
      } catch (error) {
        console.error("Ошибка при проверке платежа:", error)
        setIsVerifying(false)
        setIsSuccess(false)
        toast.error("Произошла ошибка при проверке платежа")
      }
    }
    
    verifyPayment()
  }, [paymentId, purchaseId, checkAttempts, completePurchase])
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isVerifying ? (
              `Проверка платежа... (${checkAttempts}/10)`
            ) : isSuccess ? (
              "Оплата успешно завершена!"
            ) : (
              "Ошибка при проверке платежа"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isVerifying ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : isSuccess ? (
            <>
              <div className="flex justify-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                Кредиты успешно добавлены на ваш счет. Теперь вы можете использовать все возможности Bazarius AI.
              </p>
              <Button 
                onClick={() => router.push("/bazarius")} 
                className="w-full gap-2"
              >
                Вернуться к сервисам
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                Не удалось подтвердить платеж. Пожалуйста, обратитесь в поддержку или попробуйте снова.
              </p>
              <Button 
                onClick={() => router.push("/bazarius/pricing")} 
                className="w-full"
              >
                Вернуться к выбору плана
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 