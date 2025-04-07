import { NextResponse } from "next/server"
import YooKassa from "yookassa"
import crypto from 'crypto'
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Инициализация ЮКассы
const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!
})

// Инициализация Convex клиента
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Правильная реализация проверки подписи
const isValidSignature = (signature: string, body: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Пропускаем проверку подписи в режиме разработки');
    return true;
  }
  
  try {
    const hmac = crypto.createHmac('sha1', process.env.YOOKASSA_SECRET_KEY!);
    hmac.update(body);
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
  } catch (error) {
    console.error('Ошибка при проверке подписи:', error);
    return false;
  }
};

export async function POST(req: Request) {
  try {
    // Получаем тело запроса
    const body = await req.text()
    
    // Подробное логирование для отладки
    console.log("WEBHOOK: Получено уведомление от ЮКассы, сырые данные:", body);
    
    // Проверяем подпись запроса от ЮКассы
    const signature = req.headers.get("Idempotence-Key") || req.headers.get("X-Signature");
    if (!signature || !isValidSignature(signature, body)) {
      console.error("WEBHOOK: Недействительная подпись запроса")
      return NextResponse.json({ success: false }, { status: 401 })
    }
    
    // Парсим данные уведомления
    const notification = JSON.parse(body)
    console.log("WEBHOOK: Данные уведомления:", {
      event: notification.event,
      paymentId: notification.object.id,
      status: notification.object.status,
      metadata: notification.object.metadata
    });
    
    // Проверяем тип уведомления
    if (notification.event !== "payment.succeeded" && notification.event !== "payment.waiting_for_capture") {
      console.log(`WEBHOOK: Игнорируем уведомление типа ${notification.event}`)
      return NextResponse.json({ success: true })
    }
    
    // Получаем данные платежа
    const payment = notification.object
    
    // Если платеж ожидает подтверждения и capture=true, подтверждаем его
    if (notification.event === "payment.waiting_for_capture") {
      console.log(`WEBHOOK: Подтверждаем платеж ${payment.id}`);
      try {
        const capturedPayment = await (yooKassa as any).createCapture(payment.id, {
          amount: payment.amount
        });
        console.log(`WEBHOOK: Платеж ${payment.id} подтвержден`, capturedPayment);
      } catch (error) {
        console.error(`WEBHOOK: Ошибка при подтверждении платежа ${payment.id}:`, error);
      }
      return NextResponse.json({ success: true });
    }
    
    // Проверяем статус платежа
    if (payment.status !== "succeeded") {
      console.log(`WEBHOOK: Платеж не успешен, статус: ${payment.status}`)
      return NextResponse.json({ success: true })
    }
    
    // Получаем ID покупки из метаданных
    const purchaseId = payment.metadata?.purchaseId
    if (!purchaseId) {
      console.error("WEBHOOK: В метаданных платежа отсутствует ID покупки")
      return NextResponse.json({ success: false }, { status: 400 })
    }
    
    // Обновляем статус покупки в базе данных
    try {
      await convex.mutation(api.creditPurchases.updatePaymentStatus, {
        purchaseId,
        paymentId: payment.id,
        status: "completed"
      })
      
      console.log(`WEBHOOK: Статус покупки ${purchaseId} обновлен на "completed"`)
    } catch (error) {
      console.error("WEBHOOK: Ошибка при обновлении статуса покупки:", error)
      return NextResponse.json({ success: false }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("WEBHOOK: Ошибка при обработке вебхука:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
} 