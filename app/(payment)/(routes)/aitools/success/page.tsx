"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AIToolsSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    toast.success("Заказ успешно создан!")
    toast.info("Мы обработаем вашу заявку в течение 24 часов")
    
    // Редирект через 5 секунд
    const timeout = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Спасибо за заказ!</h1>
        <p className="text-muted-foreground">
          Мы обработаем вашу заявку в течение 24 часов и свяжемся с вами.
        </p>
      </div>
    </div>
  )
} 