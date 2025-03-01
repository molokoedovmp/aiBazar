import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Подробное логирование
    console.log('=== Webhook Notification ===')
    console.log('Event:', body.event)
    console.log('Payment ID:', body.object.id)
    console.log('Status:', body.object.status)
    console.log('Metadata:', body.object.metadata)
    console.log('========================')

    console.log('Webhook received:', {
      event: body.event,
      paymentId: body.object.id,
      status: body.object.status,
      metadata: body.object.metadata
    });

    // Обрабатываем уведомление
    if (body.event === 'payment.succeeded') {
      const convexId = body.object.metadata.convexId
      if (convexId) {
        await convex.mutation(api.payments.updateStatus, {
          id: convexId,
          status: "completed"
        })
      }
    } else if (body.event === 'payment.waiting_for_capture') {
      const convexId = body.object.metadata.convexId
      if (convexId) {
        await convex.mutation(api.payments.updateStatus, {
          id: convexId,
          status: "pending"
        })
      }
    } else if (body.event === 'payment.canceled') {
      const convexId = body.object.metadata.convexId
      if (convexId) {
        await convex.mutation(api.payments.updateStatus, {
          id: convexId,
          status: "failed"
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Webhook error', { status: 500 })
  }
} 