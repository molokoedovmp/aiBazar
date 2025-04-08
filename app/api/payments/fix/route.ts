import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const purchaseId = url.searchParams.get("purchaseId")
    const userId = url.searchParams.get("userId")
    const amount = parseInt(url.searchParams.get("amount") || "1")
    
    if (!purchaseId || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing parameters" 
      }, { status: 400 })
    }
    
    // Инициализируем клиент Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    
    // Генерируем фиктивный ID платежа для отслеживания
    const dummyPaymentId = `manual_fix_${Date.now()}`
    
    // Обновляем статус покупки
    await convex.mutation(api.creditPurchases.markAsCompleted, {
      purchaseId,
      paymentId: dummyPaymentId
    })
    
    // Начисляем кредиты пользователю
    await convex.mutation(api.userCredits.addCredits, {
      userId,
      amount
    })
    
    return NextResponse.json({
      success: true,
      message: "Payment processed manually",
      paymentId: dummyPaymentId
    })
  } catch (error) {
    console.error("Error fixing payment:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process payment" 
    }, { status: 500 })
  }
} 