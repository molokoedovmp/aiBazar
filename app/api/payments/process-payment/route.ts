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
    
    // Инициализация Convex клиента
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    
    // Получаем данные о покупке
    const purchase = await convex.query(api.creditPurchases.getById, { purchaseId })
    
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Purchase not found" }, { status: 404 })
    }
    
    // Если статус уже completed, просто возвращаем успех
    if (purchase.status === "completed") {
      return NextResponse.json({
        success: true,
        status: "succeeded",
        message: "Payment already processed"
      })
    }
    
    // Инициализируем ЮКассу
    const yooKassa = new YooKassa({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!
    })
    
    // Если у покупки нет paymentId, нужно найти по метаданным
    if (!purchase.paymentId) {
      // Получаем список всех платежей за последние 24 часа
      // В реальном проекте стоит добавить более точный фильтр
      const paymentsResponse = await yooKassa.getPayments({
        created_at: { 
          gte: new Date(Date.now() - 86400000).toISOString()
        }
      })
      
      // Используем правильную типизацию для платежа
      const payment = paymentsResponse.items.find(p => 
        p.metadata && p.metadata.purchaseId === purchaseId
      )
      
      if (payment) {
        // Нашли платеж, обрабатываем его
        if (payment.status === "succeeded" || payment.paid === true) {
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
            status: "succeeded",
            message: "Payment processed successfully"
          })
        } else {
          // Платеж найден, но не завершен
          return NextResponse.json({
            success: false,
            status: payment.status,
            message: "Payment found but not completed"
          })
        }
      } else {
        // Платеж не найден
        return NextResponse.json({
          success: false,
          status: "not_found",
          message: "Payment not found in YooKassa"
        })
      }
    } else {
      // У покупки есть paymentId, проверяем его статус
      const payment = await yooKassa.getPayment(purchase.paymentId)
      
      if (payment.status === "succeeded" || payment.paid === true) {
        // Обновляем статус покупки, если он еще не completed
        if (purchase.status !== "completed") {
          await convex.mutation(api.creditPurchases.markAsCompleted, {
            purchaseId,
            paymentId: payment.id
          })
          
          // Начисляем кредиты
          await convex.mutation(api.userCredits.addCredits, {
            userId: purchase.userId,
            amount: purchase.amount
          })
        }
        
        return NextResponse.json({
          success: true,
          status: "succeeded",
          message: "Payment confirmed and processed"
        })
      } else {
        // Платеж найден, но не завершен
        return NextResponse.json({
          success: false,
          status: payment.status,
          message: "Payment is still in progress"
        })
      }
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process payment" 
    }, { status: 500 })
  }
} 