import { NextResponse } from "next/server"
import YooKassa from "yookassa"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const purchaseId = url.searchParams.get("purchaseId")
    
    if (!purchaseId) {
      return NextResponse.json({ success: false, error: "Missing purchaseId" }, { status: 400 })
    }
    
    // Инициализация Convex клиента
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    
    // Получаем данные о покупке
    const purchase = await convex.query(api.creditPurchases.getById, { purchaseId })
    
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Purchase not found" }, { status: 404 })
    }
    
    // Если у покупки уже есть paymentId, проверяем статус платежа
    if (purchase.paymentId) {
      const yooKassa = new YooKassa({
        shopId: process.env.YOOKASSA_SHOP_ID!,
        secretKey: process.env.YOOKASSA_SECRET_KEY!
      })
      
      const payment = await yooKassa.getPayment(purchase.paymentId)
      
      return NextResponse.json({
        success: true,
        status: payment.status,
        paid: payment.paid,
        amount: purchase.amount,
        paymentId: purchase.paymentId
      })
    }
    
    // Если у покупки нет paymentId, возвращаем статус из базы
    return NextResponse.json({
      success: true,
      status: purchase.status === "completed" ? "succeeded" : purchase.status,
      amount: purchase.amount
    })
  } catch (error) {
    console.error("Ошибка при проверке платежа:", error)
    return NextResponse.json({ success: false, error: "Failed to check payment" }, { status: 500 })
  }
} 