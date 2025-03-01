import { NextResponse } from "next/server"
import YooKassa from "yookassa"

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, description, paymentId, contactInfo } = body

    console.log('Creating payment:', { amount, description, paymentId })

    // Извлекаем email из contactInfo или используем email из Clerk
    const email = contactInfo.includes('@') ? contactInfo : "customer@example.com"

    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: "RUB"
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?convexId=${paymentId}`
      },
      description: description,
      metadata: {
        convexId: paymentId
      },
      receipt: {
        customer: {
          email: email
        },
        items: [
          {
            description: description,
            quantity: "1",
            amount: {
              value: amount.toFixed(2),
              currency: "RUB"
            },
            vat_code: "1", // НДС 20%
            payment_subject: "service",
            payment_mode: "full_prepayment"
          }
        ]
      }
    })

    console.log('YooKassa response:', payment)

    // Проверяем наличие URL подтверждения в ответе
    if (!payment.confirmation?.confirmation_url) {
      throw new Error('No confirmation URL in YooKassa response')
    }

    return NextResponse.json({
      confirmation_url: payment.confirmation.confirmation_url,
      payment_id: payment.id
    })

  } catch (error) {
    console.error("YooKassa error:", error)
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Payment creation failed' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 