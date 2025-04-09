import { NextResponse } from "next/server"
import YooKassa from "yookassa"

export async function POST(req: Request) {
  try {
    const { amount, description, purchaseId, userId, returnUrl } = await req.json()
    const userEmail = req.headers.get("x-user-email") || "customer@example.com"

    const yooKassa = new YooKassa({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!,
    })

    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      description,
      metadata: {
        purchaseId,
        userId,
        amount,
      },
      receipt: {
        customer: {
          email: userEmail,
        },
        items: [
          {
            description,
            quantity: "1",
            amount: {
              value: amount.toFixed(2),
              currency: "RUB",
            },
            vat_code: "1",
            payment_subject: "service",
            payment_mode: "full_payment",
          },
        ],
      },
    })

    return NextResponse.json({
      success: true,
      paymentUrl: payment.confirmation.confirmation_url,
      paymentId: payment.id,
    })
  } catch (error: any) {
    console.error("[CREATE PAYMENT] Ошибка:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Ошибка при создании платежа",
      },
      { status: 500 }
    )
  }
}
