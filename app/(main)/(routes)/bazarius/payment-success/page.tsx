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
  const purchaseId = searchParams.get("purchaseId")
  const [isProcessing, setIsProcessing] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Мутация для обновления статуса покупки и добавления кредитов
  const completePurchase = useMutation(api.creditPurchases.completePurchase)
  
  // Функция для проверки статуса платежа
  const checkPaymentStatus = async (purchaseId: string) => {
    try {
      // Запрашиваем статус платежа
      const response = await fetch(`/api/payments/check?purchaseId=${purchaseId}`, {
        method: "GET"
      })
      
      if (!response.ok) {
        throw new Error("Ошибка при проверке статуса платежа")
      }
      
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Ошибка при проверке статуса платежа:", error)
      return false
    }
  }
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!purchaseId) {
        setIsProcessing(false)
        return
      }
      
      try {
        // Проверяем статус платежа
        const isPaymentSuccessful = await checkPaymentStatus(purchaseId)
        
        if (isPaymentSuccessful) {
          setIsSuccess(true)
          toast.success("Оплата успешно завершена! Кредиты добавлены на ваш счет.")
        } else {
          // Если платеж не подтвержден, пробуем обновить статус через Convex
          const result = await completePurchase({ 
            purchaseId: purchaseId as any 
          })
          
          if (result.success) {
            setIsSuccess(true)
            toast.success("Оплата успешно завершена! Кредиты добавлены на ваш счет.")
          } else {
            toast.error("Не удалось подтвердить платеж. Пожалуйста, обратитесь в поддержку.")
          }
        }
      } catch (error) {
        console.error("Ошибка при проверке платежа:", error)
        toast.error("Произошла ошибка при проверке платежа")
      } finally {
        setIsProcessing(false)
      }
    }
    
    verifyPayment()
  }, [purchaseId, completePurchase])
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isProcessing ? (
              "Проверка платежа..."
            ) : isSuccess ? (
              "Оплата успешно завершена!"
            ) : (
              "Ошибка при проверке платежа"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isProcessing ? (
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