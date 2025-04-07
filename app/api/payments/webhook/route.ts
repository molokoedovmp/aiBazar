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

export async function POST(req: Request) {
  try {
    // Получаем тело запроса
    const body = await req.text()
    
    // Проверяем подпись запроса от ЮКассы
    const signature = req.headers.get("Idempotence-Key")
    if (!signature) {
      console.error("Отсутствует подпись запроса")
      return NextResponse.json({ success: false }, { status: 401 })
    }
    
    // Парсим данные уведомления
    const notification = JSON.parse(body)
    console.log("Получено уведомление от ЮКассы:", notification)
    
    // Проверяем тип уведомления
    if (notification.event !== "payment.succeeded") {
      console.log(`Игнорируем уведомление типа ${notification.event}`)
      return NextResponse.json({ success: true })
    }
    
    // Получаем данные платежа
    const payment = notification.object
    
    // Проверяем статус платежа
    if (payment.status !== "succeeded") {
      console.log(`Платеж не успешен, статус: ${payment.status}`)
      return NextResponse.json({ success: true })
    }
    
    // Получаем ID покупки из метаданных
    const purchaseId = payment.metadata?.purchaseId
    if (!purchaseId) {
      console.error("В метаданных платежа отсутствует ID покупки")
      return NextResponse.json({ success: false }, { status: 400 })
    }
    
    // Обновляем статус покупки в базе данных
    try {
      await convex.mutation(api.creditPurchases.updatePaymentStatus, {
        purchaseId,
        paymentId: payment.id,
        status: "completed"
      })
      
      console.log(`Статус покупки ${purchaseId} обновлен на "completed"`)
    } catch (error) {
      console.error("Ошибка при обновлении статуса покупки:", error)
      return NextResponse.json({ success: false }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка при обработке вебхука:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
} 