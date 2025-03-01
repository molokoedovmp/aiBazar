"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const updatePaymentStatus = useMutation(api.payments.updateStatus)

  useEffect(() => {
    const handlePayment = async () => {
      const convexId = searchParams.get("convexId")
      const yooKassaId = searchParams.get("payment_id")
      
      if (convexId && yooKassaId) {
        try {
          const response = await fetch(`/api/check-payment?paymentId=${yooKassaId}`)
          if (!response.ok) throw new Error('Failed to check payment status')
          
          const payment = await response.json()
          console.log('Payment status:', payment)

          if (payment.status === "succeeded" || payment.paid === true) {
            toast.success("Оплата прошла успешно!")
            router.push("/aibazargpt")
          } else if (payment.status === "canceled") {
            toast.error("Платеж был отменен")
            router.push("/payment/failed")
          } else {
            // Проверяем статус каждые 5 секунд
            setTimeout(() => {
              router.refresh()
            }, 5000)
          }
        } catch (error) {
          console.error("Payment verification error:", error)
          toast.error("Ошибка при проверке платежа")
          router.push("/payment/failed")
        }
      }
    }

    handlePayment()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">
                Платёж обрабатывается
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
                Ваш платёж находится в обработке. Это может занять некоторое время.
                Мы уведомим вас о статусе платежа.
              </p>
            </div>

            <div className="w-full pt-4">
              <Link href="/purchases" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium"
                >
                  Перейти к моим покупкам
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 