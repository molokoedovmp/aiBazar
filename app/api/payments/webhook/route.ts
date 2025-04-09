import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Считываем JSON из тела запроса
    const payload = await req.json()
    console.log("[WEBHOOK] Получен webhook:", payload)

    // Тип события и объект платежа из уведомления
    const event = payload?.event
    const payment = payload?.object
    const metadata = payment?.metadata || {}

    const purchaseId = metadata.purchaseId
    const userId = metadata.userId
    const amount = parseInt(metadata.amount)
    const paymentId = payment?.id

    if (!purchaseId || !userId || !paymentId) {
      console.warn("[WEBHOOK] Недостаточно данных")
      return NextResponse.json({ success: true }) // 200 OK
    }

    // Обработка событий
    if (event === "payment.succeeded") {
      console.log("[WEBHOOK] Событие: оплата успешна")
      // Вызвать мутации / функции добавления кредитов и пр.
    }

    if (event === "payment.canceled") {
      console.log("[WEBHOOK] Событие: платёж отменён")
      // Пометить покупку как canceled
    }

    // Возвращаем 200 OK, чтобы YooKassa не слала запрос снова
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WEBHOOK] Ошибка при обработке:", error)
    // Даже в случае ошибки возвращаем 200,
    // чтобы YooKassa не слала повторных запросов
    return NextResponse.json({ success: true })
  }
}

// Preflight-запросы (CORS) — если нужны
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
