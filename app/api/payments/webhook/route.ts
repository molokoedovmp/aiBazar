import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    console.log("[WEBHOOK] Получен webhook:", payload)

    const metadata = payload.object?.metadata || {}
    const event = payload.event
    const paymentId = payload.object?.id

    const purchaseId = metadata.purchaseId
    const userId = metadata.userId
    const amount = parseInt(metadata.amount)

    if (!purchaseId || !userId || !paymentId) {
      console.error("[WEBHOOK] Отсутствуют важные поля")
      return NextResponse.json({ success: true })
    }

    // Обработка успешного платежа
    if (event === "payment.succeeded") {
      console.log("[WEBHOOK] Платеж успешен, начисляем кредиты")

      try {
        // Обновить статус покупки
        await convex.mutation(api.creditPurchases.markAsCompleted, {
          purchaseId,
          paymentId,
        })

        // Начислить кредиты пользователю
        await convex.mutation(api.userCredits.addCredits, {
          userId,
          amount,
        })

        console.log("[WEBHOOK] Успешно завершено")
      } catch (err) {
        console.error("[WEBHOOK] Ошибка при успешной обработке:", err)
      }
    }

    // Обработка отмены/неуспешного платежа
    if (event === "payment.canceled") {
      console.log("[WEBHOOK] Платеж отменён")

      try {
        await convex.mutation(api.creditPurchases.markAsCanceled, {
          purchaseId,
        })
      } catch (err) {
        console.error("[WEBHOOK] Ошибка при отмене:", err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[WEBHOOK] Ошибка парсинга:", err)
    return NextResponse.json({ success: true })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
