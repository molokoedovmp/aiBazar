import { NextResponse } from "next/server"
import YooKassa from "yookassa"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Инициализация ЮКассы
const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!
})

// Инициализация Convex клиента
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const paymentId = url.searchParams.get("payment_id")
    
    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Отсутствует ID платежа" },
        { status: 400 }
      )
    }
    
    // Получаем информацию о платеже из ЮКассы
    const payment = await yooKassa.getPayment(paymentId)
    
    return NextResponse.json({
      success: true,
      status: payment.status,
      paid: payment.paid
    })
  } catch (error) {
    console.error("Ошибка при проверке платежа:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при проверке платежа" },
      { status: 500 }
    )
  }
} 