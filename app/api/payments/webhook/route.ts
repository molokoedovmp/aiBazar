import { NextResponse } from "next/server"
import crypto from "crypto"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Простой логгер для отладки
function log(message: string, data?: any) {
  console.log(`[WEBHOOK] ${message}`, data || '');
}

// Инициализация Convex клиента
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function verifyWebhookSignature(body: string, signature: string | null, secretKey: string): boolean {
  if (!signature) return false
  
  const hmac = crypto.createHmac('sha256', secretKey)
  const calculatedSignature = hmac.update(body).digest('base64')
  
  return signature === calculatedSignature
}

export async function POST(req: Request) {
  try {
    // Получаем тело запроса как строку для проверки подписи
    const body = await req.text()
    const signature = req.headers.get('X-Signature')
    
    // Проверяем подпись
    const isValid = verifyWebhookSignature(
      body, 
      signature,
      process.env.YOOKASSA_SECRET_KEY!
    )
    
    if (!isValid) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
    
    // Парсим тело запроса
    const payload = JSON.parse(body)
    console.log("Webhook received:", payload)
    
    const event = payload.event
    const payment = payload.object
    
    if (!payment || !payment.metadata || !payment.metadata.purchaseId) {
      console.error("Missing required payment data")
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 })
    }
    
    const purchaseId = payment.metadata.purchaseId
    const userId = payment.metadata.userId
    
    switch (event) {
      case 'payment.succeeded':
        // Платеж успешно завершен
        await convex.mutation(api.creditPurchases.markAsCompleted, {
          purchaseId,
          paymentId: payment.id
        })
        
        // Начисляем кредиты
        if (userId && payment.metadata.amount) {
          await convex.mutation(api.userCredits.addCredits, {
            userId,
            amount: parseInt(payment.metadata.amount)
          })
        }
        break
        
      case 'payment.canceled':
        // Получаем текущую запись
        const currentPurchase = await convex.query(api.creditPurchases.getById, { 
          purchaseId 
        });
        
        if (currentPurchase) {
          // Обновляем статус, сохраняя остальные поля
          await convex.mutation(api.creditPurchases.update, {
            id: purchaseId,
            status: "canceled",
            paymentId: payment.id,
            userId: currentPurchase.userId,
            price: currentPurchase.price,
            amount: currentPurchase.amount,
            timestamp: currentPurchase.timestamp
          });
        }
        break
        
      case 'payment.waiting_for_capture':
        const waitingPurchase = await convex.query(api.creditPurchases.getById, { 
          purchaseId 
        });
        
        if (waitingPurchase) {
          await convex.mutation(api.creditPurchases.update, {
            id: purchaseId,
            status: "waiting_for_capture",
            paymentId: payment.id,
            userId: waitingPurchase.userId,
            price: waitingPurchase.price,
            amount: waitingPurchase.amount,
            timestamp: waitingPurchase.timestamp
          });
        }
        break
    }
    
    // Всегда возвращаем 200 OK
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("Webhook error:", error)
    // Возвращаем 200 даже при ошибке, чтобы ЮКасса не пыталась повторить запрос
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