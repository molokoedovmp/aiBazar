import { NextResponse } from "next/server"
import YooKassa from "yookassa"

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return new NextResponse("Payment ID is required", { status: 400 })
    }

    const payment = await yooKassa.getPayment(paymentId)
    return NextResponse.json(payment)
  } catch (error) {
    console.error("YooKassa error:", error)
    return new NextResponse("Payment check failed", { status: 500 })
  }
} 