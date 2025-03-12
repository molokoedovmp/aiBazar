"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Перенаправляем на главную страницу администратора
    // Там будет показана форма входа, если пользователь не авторизован
    router.push("/admin")
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Перенаправление на страницу входа...</p>
    </div>
  )
} 