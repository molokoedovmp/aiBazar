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
    const purchaseId = url.searchParams.get("purchase_id")
    
    if (!paymentId || !purchaseId) {
      return NextResponse.json({
        success: false,
        error: "Необходимы payment_id и purchase_id"
      }, { status: 400 })
    }
    
    // Проверяем статус платежа в ЮКассе
    const payment = await yooKassa.getPayment(paymentId)
    console.log("Статус платежа:", payment)
    
    // Если платеж в статусе waiting_for_capture, подтверждаем его
    if (payment.status === "waiting_for_capture") {
      const capturedPayment = await (yooKassa as any).createCapture(paymentId, {
        amount: payment.amount
      })
      console.log("Платеж подтвержден:", capturedPayment)
    }
    
    // Если платеж успешен, обновляем статус в базе данных
    if (payment.status === "succeeded" || payment.paid === true) {
      await convex.mutation(api.creditPurchases.updatePaymentStatus, {
        purchaseId,
        paymentId,
        status: "completed"
      })
      
      // Зачисляем кредиты
      await convex.mutation(api.creditPurchases.completePurchase, {
        purchaseId
      })
      
      return NextResponse.json({
        success: true,
        status: payment.status,
        message: "Статус платежа успешно обновлен и кредиты начислены"
      })
    }
    
    return NextResponse.json({
      success: true,
      status: payment.status,
      message: "Платеж еще не завершен"
    })
  } catch (error) {
    console.error("Ошибка при отладке платежа:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при отладке платежа"
    }, { status: 500 })
  }
} 