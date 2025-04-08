import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    console.log("[WEBHOOK] Получен webhook:", payload)
    
    // Получаем данные из метаданных платежа
    const metadata = payload.object?.metadata || {}
    console.log("[WEBHOOK] Метаданные:", metadata)
    
    const purchaseId = metadata.purchaseId
    const userId = metadata.userId
    const amount = parseInt(metadata.amount)
    
    console.log("[WEBHOOK] Данные для обработки:", { purchaseId, userId, amount })
    
    if (payload.event === "payment.succeeded") {
      console.log("[WEBHOOK] Начинаем обработку успешного платежа")
      
      try {
        // Обновляем статус покупки
        console.log("[WEBHOOK] Обновляем статус покупки")
        await convex.mutation(api.creditPurchases.markAsCompleted, {
          purchaseId,
          paymentId: payload.object.id
        })
        
        // Начисляем кредиты
        console.log("[WEBHOOK] Начисляем кредиты:", { userId, amount })
        await convex.mutation(api.userCredits.addCredits, {
          userId,
          amount
        })
        
        console.log("[WEBHOOK] Платеж успешно обработан")
      } catch (error) {
        console.error("[WEBHOOK] Ошибка при обработке платежа:", error)
        // Даже при ошибке возвращаем 200, чтобы ЮКасса не пыталась повторить
        return NextResponse.json({ success: true })
      }
    } else {
      console.log("[WEBHOOK] Пропускаем событие:", payload.event)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WEBHOOK] Критическая ошибка:", error)
    return NextResponse.json({ success: true })
  }
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 