import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Простой логгер для отладки
function log(message: string, data?: any) {
  console.log(`[WEBHOOK] ${message}`, data || '');
}

// Инициализация Convex клиента
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  try {
    // Логируем все заголовки для отладки
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    log("Получены заголовки:", headers);
    
    // Получаем данные от ЮКассы
    const payload = await req.json();
    log("Получен webhook:", payload);
    
    // Обрабатываем платеж без проверки подписи для тестирования
    if (payload.event === "payment.succeeded") {
      const paymentId = payload.object?.id;
      const metadata = payload.object?.metadata || {};
      const purchaseId = metadata.purchaseId;
      const userId = metadata.userId;
      
      log("Обработка успешного платежа:", { paymentId, purchaseId, userId });
      
      if (purchaseId && userId) {
        try {
          // Обновляем статус в БД напрямую
          await convex.mutation(api.creditPurchases.markAsCompleted, {
            purchaseId: purchaseId,
            paymentId: paymentId
          });
          
          // Начисляем кредиты
          await convex.mutation(api.userCredits.addCredits, {
            userId: userId,
            amount: metadata.amount || 1 // Используем количество из метаданных или 1 как запасной вариант
          });
          
          log("Платеж обработан успешно");
        } catch (error) {
          log("Ошибка при обновлении данных:", error);
        }
      }
    }
    
    // Всегда возвращаем успешный ответ для ЮКассы
    return NextResponse.json({ success: true });
  } catch (error) {
    log("Критическая ошибка обработки webhook:", error);
    // Возвращаем успех даже при ошибке, чтобы ЮКасса не пыталась переотправить
    return NextResponse.json({ success: true });
  }
} 