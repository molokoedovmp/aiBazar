"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/spinner"
import { CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  
  const purchaseId = searchParams.get("purchaseId")
  
  // Получаем информацию о покупке
  const purchase = useQuery(api.creditPurchases.getById, { purchaseId: purchaseId || "" })
  
  // Мутации для обновления покупки и добавления кредитов
  const markAsCompleted = useMutation(api.creditPurchases.markAsCompleted)
  const addCredits = useMutation(api.userCredits.addCredits)
  
  useEffect(() => {
    // Если нет purchaseId или нет данных о покупке, не делаем ничего
    if (!purchaseId || !purchase || !user) return
    
    const processPayment = async () => {
      try {
        // Если покупка уже завершена, просто показываем успех
        if (purchase.status === "completed") {
          setStatus("success")
          return
        }
        
        // Обновляем статус покупки на "completed"
        await markAsCompleted({
          purchaseId,
          paymentId: purchase.paymentId || "manual"
        })
        
        // Добавляем кредиты пользователю
        await addCredits({
          userId: user.id,
          amount: purchase.amount
        })
        
        setStatus("success")
        
        // Перенаправляем через 3 секунды
        setTimeout(() => {
          router.push("/bazarius")
        }, 3000)
      } catch (error) {
        console.error("Ошибка при обработке платежа:", error)
        setStatus("error")
      }
    }
    
    processPayment()
  }, [purchaseId, purchase, user, markAsCompleted, addCredits, router])
  
  return (
    <div className="container mx-auto p-8 max-w-md">
      <div className="bg-card p-8 shadow-md rounded-lg text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12">
              <Spinner />
            </div>
            <h1 className="text-2xl font-bold">Завершение платежа</h1>
            <p className="text-muted-foreground">
              Подождите, мы начисляем вам кредиты...
            </p>
          </div>
        )}
        
        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Оплата успешна!</h1>
            <p className="text-muted-foreground">
              Кредиты успешно начислены на ваш счет.
            </p>
            <div className="text-sm text-muted-foreground">
              Перенаправление на главную...
            </div>
          </motion.div>
        )}
        
        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600">Ошибка</h1>
            <p className="text-muted-foreground">
              Не удалось начислить кредиты. Пожалуйста, обратитесь в поддержку.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 