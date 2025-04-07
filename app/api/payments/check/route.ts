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
    // Получаем ID покупки из параметров запроса
    const url = new URL(req.url)
    const purchaseId = url.searchParams.get("purchaseId")
    
    if (!purchaseId) {
      return NextResponse.json(
        { success: false, error: "Отсутствует ID покупки" },
        { status: 400 }
      )
    }
    
    // Получаем информацию о покупке из Convex
    const purchase = await convex.query(api.creditPurchases.getById, { purchaseId })
    
    if (!purchase) {
      return NextResponse.json(
        { success: false, error: "Покупка не найдена" },
        { status: 404 }
      )
    }
    
    // Если у покупки уже статус "completed", возвращаем успех
    if (purchase && 'status' in purchase && purchase.status === "completed") {
      return NextResponse.json({ success: true })
    }
    
    // Если у покупки есть ID платежа, проверяем его статус в ЮКассе
    if (purchase && 'paymentId' in purchase && purchase.paymentId) {
      const payment = await yooKassa.getPayment(purchase.paymentId)
      
      if (payment.status === "succeeded") {
        // Обновляем статус покупки
        await convex.mutation(api.creditPurchases.updatePaymentStatus, {
          purchaseId,
          paymentId: purchase.paymentId,
          status: "completed"
        })
        
        return NextResponse.json({ success: true })
      }
    }
    
    // Если платеж не найден или не успешен
    return NextResponse.json({ success: false })
  } catch (error) {
    console.error("Ошибка при проверке статуса платежа:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при проверке статуса платежа" },
      { status: 500 }
    )
  }
} 