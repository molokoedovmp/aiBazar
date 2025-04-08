import { NextResponse } from "next/server"
import YooKassa from "yookassa"

export async function POST(req: Request) {
  try {
    const { amount, description, purchaseId, userId, returnUrl } = await req.json()
    
    // Получаем данные пользователя из запроса (email обязателен для чека)
    const userEmail = req.headers.get('x-user-email') || 'customer@example.com'
    
    console.log("Создание платежа:", { amount, description, purchaseId, userId })
    
    // Проверяем, что переменные окружения установлены
    if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
      console.error("Отсутствуют переменные окружения для ЮКассы")
      return NextResponse.json(
        { success: false, error: "Неправильная конфигурация ЮКассы" },
        { status: 500 }
      )
    }
    
    // Инициализируем ЮКассу
    const yooKassa = new YooKassa({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!
    })
    
    // Создаем платеж
    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: "RUB"
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: returnUrl
      },
      description,
      metadata: {
        purchaseId,
        userId,
        amount
      },
      // Добавляем чек для фискализации (обязательно в проде)
      receipt: {
        customer: {
          email: userEmail
        },
        items: [
          {
            description,
            quantity: "1",
            amount: {
              value: amount.toString(),
              currency: "RUB"
            },
            vat_code: "1", // Без НДС
            payment_subject: "service", // Услуга
            payment_mode: "full_payment" // Полная оплата
          }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      paymentUrl: payment.confirmation.confirmation_url,
      paymentId: payment.id
    })
    
  } catch (error: any) {
    console.error("Ошибка при создании платежа:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Ошибка при создании платежа"
    }, { status: 500 })
  }
} 