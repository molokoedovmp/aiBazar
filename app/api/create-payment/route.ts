import { NextResponse } from "next/server"
import YooKassa from "yookassa"

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, description, paymentId } = body

    console.log('Creating payment with:', { amount, description, paymentId }) // Для отладки

    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: "RUB"
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `http://localhost:3000/payment/success?convexId=${paymentId}`
      },
      description: `Оплата ${description}`,
      metadata: {
        convexId: paymentId
      }
    })

    console.log('YooKassa response:', payment) // Для отладки

    if (!payment.confirmation?.confirmation_url) {
      throw new Error('No confirmation URL in response')
    }

    return NextResponse.json({
      confirmation_url: payment.confirmation.confirmation_url,
      payment_id: payment.id
    })

  } catch (error) {
    console.error("YooKassa error details:", error)
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500 }
    )
  }
} 