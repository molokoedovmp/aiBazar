"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Spinner } from "@/components/spinner"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const purchaseId = searchParams.get("purchaseId")
  const { user } = useUser()
  const [status, setStatus] = useState("checking") // checking, success, failed
  const updatePurchase = useMutation(api.creditPurchases.markAsCompleted)
  const addCredits = useMutation(api.userCredits.addCredits)

  useEffect(() => {
    if (!purchaseId) return
    
    // Проверяем статус платежа напрямую
    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/payments/check?purchaseId=${purchaseId}`)
        const data = await response.json()
        
        console.log("Проверка статуса платежа:", data)
        
        if (data.success && data.status === "succeeded") {
          // Если платеж успешен, но webhook не обработал, делаем это вручную
          await updatePurchase({
            purchaseId: purchaseId,
            paymentId: data.paymentId
          })
          
          // Начисляем кредиты
          if (user) {
            await addCredits({
              userId: user.id,
              amount: data.amount || 1
            })
          }
          
          setStatus("success")
        } else if (data.status === "pending") {
          // Если платеж в обработке, проверяем снова через 3 секунды
          setTimeout(checkPayment, 3000)
        } else {
          setStatus("failed")
        }
      } catch (error) {
        console.error("Ошибка при проверке платежа:", error)
        setStatus("failed")
      }
    }
    
    checkPayment()
  }, [purchaseId, user])
  
  return (
    <div>
      {status === "checking" && (
        <div>
          <Spinner />
          <p>Проверка статуса платежа...</p>
        </div>
      )}
      
      {status === "success" && (
        <div>
          <h1>Платеж успешно обработан</h1>
          <p>Кредиты начислены на ваш счет</p>
        </div>
      )}
      
      {status === "failed" && (
        <div>
          <h1>Ошибка обработки платежа</h1>
          <p>Пожалуйста, свяжитесь с поддержкой</p>
        </div>
      )}
    </div>
  )
} 