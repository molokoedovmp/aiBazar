import { NextResponse } from "next/server"
import YooKassa from "yookassa"

// Инициализация ЮКассы
const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!
})

export async function POST(req: Request) {
  try {
    const { amount, description, purchaseId, userId, returnUrl } = await req.json()
    
    console.log("Создание платежа:", { amount, description, purchaseId, returnUrl })
    
    // Проверяем, что переменные окружения установлены
    if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
      console.error("Отсутствуют переменные окружения для ЮКассы")
      return NextResponse.json(
        { success: false, error: "Неправильная конфигурация ЮКассы" },
        { status: 500 }
      )
    }
    
    // Создаем платеж в ЮКассе
    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toString(),
        currency: "RUB"
      },
      description: description,
      confirmation: {
        type: "redirect",
        return_url: returnUrl
      },
      metadata: {
        purchaseId: purchaseId,
        userId: userId
      },
      capture: true
    })
    
    console.log("Платеж создан:", payment)
    
    // Возвращаем URL для перенаправления на страницу оплаты
    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentUrl: payment.confirmation.confirmation_url
    })
  } catch (error) {
    console.error("Ошибка при создании платежа:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при создании платежа" },
      { status: 500 }
    )
  }
} 