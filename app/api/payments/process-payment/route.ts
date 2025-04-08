import { NextResponse } from "next/server"
import YooKassa from "yookassa"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Автоматический обработчик платежей
export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const purchaseId = url.searchParams.get("purchaseId")
    
    if (!purchaseId) {
      return NextResponse.json({ success: false, error: "Missing purchaseId" }, { status: 400 })
    }
    
    // Инициализация клиентов
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    const yooKassa = new YooKassa({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!
    })
    
    // Получаем данные о покупке
    const purchase = await convex.query(api.creditPurchases.getById, { purchaseId })
    
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Purchase not found" }, { status: 404 })
    }
    
    try {
      // Получаем платежи за последние 24 часа
      const { items } = await yooKassa.getPayments({
        created_at: { 
          gte: new Date(Date.now() - 86400000).toISOString()
        }
      })
      
      // Ищем наш платеж
      const payment = items.find(p => p.metadata?.purchaseId === purchaseId)
      
      if (payment) {
        console.log("Найден платеж:", payment)
        
        if (payment.status === "succeeded" && payment.paid) {
          // Обновляем статус покупки
          await convex.mutation(api.creditPurchases.markAsCompleted, {
            purchaseId,
            paymentId: payment.id
          })
          
          // Начисляем кредиты
          await convex.mutation(api.userCredits.addCredits, {
            userId: purchase.userId,
            amount: purchase.amount
          })
          
          return NextResponse.json({
            success: true,
            status: "succeeded"
          })
        }
        
        return NextResponse.json({
          success: false,
          status: payment.status
        })
      }
      
      return NextResponse.json({
        success: false,
        status: "not_found"
      })
      
    } catch (error) {
      console.error("Ошибка при проверке платежа:", error)
      return NextResponse.json({
        success: false,
        error: "Payment check failed"
      })
    }
    
  } catch (error) {
    console.error("Ошибка при обработке платежа:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process payment" 
    }, { status: 500 })
  }
} 