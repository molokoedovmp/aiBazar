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
    // Получаем данные от ЮКассы
    const payload = await req.json();
    const signature = req.headers.get("x-payment-sha256-hmac");
    
    console.log("Webhook получен:", { 
      event: payload.event,
      paymentId: payload.object?.id,
      status: payload.object?.status,
      paid: payload.object?.paid
    });
    
    // Проверяем подпись для безопасности
    if (process.env.NODE_ENV === "production" && signature) {
      const isValid = validateSignature(payload, signature);
      if (!isValid) {
        console.error("Неверная подпись webhook");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }
    
    // Обрабатываем платеж
    if (payload.event === "payment.succeeded") {
      // Платеж успешно оплачен
      const paymentId = payload.object.id;
      const metadata = payload.object.metadata || {};
      const purchaseId = metadata.purchaseId;
      const userId = metadata.userId;
      
      if (purchaseId) {
        try {
          // Получаем текущую запись о покупке
          const purchase = await convex.query(api.creditPurchases.getById, { 
            purchaseId: purchaseId 
          });
          
          if (purchase) {
            // Обновляем статус покупки
            await convex.mutation(api.creditPurchases.update, {
              id: purchaseId,
              status: "completed",
              paymentId,
              userId: purchase.userId,
              price: purchase.price,
              amount: purchase.amount,
              timestamp: purchase.timestamp
            });
            
            // Начисляем кредиты пользователю
            if (userId) {
              await convex.mutation(api.userCredits.addCredits, {
                userId,
                amount: purchase.amount
              });
              
              console.log(`Начислено ${purchase.amount} кредитов пользователю ${userId}`);
            }
          }
        } catch (convexError) {
          console.error("Ошибка обновления в Convex:", convexError);
        }
      }
    } else if (payload.event === "payment.canceled") {
      // Платеж отменен
      const metadata = payload.object.metadata || {};
      const purchaseId = metadata.purchaseId;
      
      if (purchaseId) {
        try {
          // Получаем текущую запись о покупке
          const canceledPurchase = await convex.query(api.creditPurchases.getById, { 
            purchaseId: purchaseId 
          });
          
          if (canceledPurchase) {
            // Обновляем статус покупки
            await convex.mutation(api.creditPurchases.update, {
              id: purchaseId,
              status: "canceled",
              paymentId: payload.object.id,
              userId: canceledPurchase.userId,
              price: canceledPurchase.price,
              amount: canceledPurchase.amount,
              timestamp: canceledPurchase.timestamp
            });
          }
        } catch (convexError) {
          console.error("Ошибка обновления в Convex:", convexError);
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка обработки webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Функция для проверки подписи
function validateSignature(payload: any, signature: string) {
  try {
    const secretKey = process.env.YOOKASSA_SECRET_KEY!;
    const hmac = crypto.createHmac('sha256', secretKey);
    const calculated = hmac.update(JSON.stringify(payload)).digest('base64');
    return calculated === signature;
  } catch (error) {
    console.error("Ошибка валидации подписи:", error);
    return false;
  }
} 