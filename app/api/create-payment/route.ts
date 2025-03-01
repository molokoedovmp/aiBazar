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

    console.log('Creating payment with amount:', amount)

    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toString(),
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
      }
    })

    console.log('Payment created:', payment)

    if (!payment.confirmation?.confirmation_url) {
      throw new Error('No confirmation URL in response')
    }

    return NextResponse.json(payment)

  } catch (error) {
    console.error('YooKassa error:', error)
    return new NextResponse('Payment creation failed', { status: 500 })
  }
} 