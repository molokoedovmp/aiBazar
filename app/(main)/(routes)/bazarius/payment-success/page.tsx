"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Spinner } from "@/components/spinner"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const purchaseId = searchParams.get("purchaseId")
  const { user } = useUser()
  const [status, setStatus] = useState("checking") // checking, success, failed
  
  useEffect(() => {
    if (!purchaseId) return
    
    // Автоматическая функция для проверки платежа через API ЮKassы
    const checkAndProcessPayment = async () => {
      try {
        // 1. Получаем информацию о покупке и платеже
        const response = await fetch(`/api/payments/process-payment?purchaseId=${purchaseId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Платеж успешно обработан
          setStatus("success");
        } else if (data.status === "pending") {
          // Если платеж в обработке, пробуем снова через пару секунд
          setTimeout(checkAndProcessPayment, 3000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Ошибка при проверке платежа:", error);
        setStatus("failed");
      }
    }
    
    // Запускаем проверку сразу
    checkAndProcessPayment();
  }, [purchaseId]);
  
  return (
    <div className="container mx-auto p-8 max-w-md">
      <div className="bg-card p-8 shadow-md rounded-lg text-center">
        {status === "checking" && (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12">
              <Spinner />
            </div>
            <h1 className="text-2xl font-bold">Проверка оплаты</h1>
            <p className="text-muted-foreground">
              Подождите, мы проверяем статус вашего платежа...
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
          </motion.div>
        )}
        
        {status === "failed" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Ошибка оплаты</h1>
            <p className="text-muted-foreground">
              Произошла ошибка при обработке платежа. Пожалуйста, свяжитесь с технической поддержкой.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 