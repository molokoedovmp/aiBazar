import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    console.log("[WEBHOOK] Получен webhook:", payload)

    const event = payload.event
    const payment = payload.object
    const metadata = payment?.metadata || {}

    const purchaseId = metadata.purchaseId
    const userId = metadata.userId
    const amount = parseInt(metadata.amount)
    const paymentId = payment?.id

    if (!purchaseId || !userId || !paymentId) {
      console.warn("[WEBHOOK] Недостаточно данных")
      return NextResponse.json({ success: true })
    }

    if (event === "payment.succeeded") {
      console.log("[WEBHOOK] Успешная оплата")

      await convex.mutation(api.creditPurchases.markAsCompleted, {
        purchaseId,
        paymentId,
      })

      await convex.mutation(api.userCredits.addCredits, {
        userId,
        amount,
      })
    }

    if (event === "payment.canceled") {
      console.log("[WEBHOOK] Платёж отменён")

      await convex.mutation(api.creditPurchases.markAsCanceled, {
        purchaseId,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WEBHOOK] Ошибка:", error)
    return NextResponse.json({ success: true }) // ЮKassa требует 200 OK
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
