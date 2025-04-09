// app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Инициализируем клиента Convex по значению переменной среды
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    // Считываем тело запроса в виде текста (нужно для проверки подписи)
    const bodyText = await req.text();

    // Попытка получить заголовок подписи – если его нет, выводим предупреждение и продолжаем
    const signatureHeader = req.headers.get("X-Request-Signature");
    const secret = process.env.YOOKASSA_SECRET_KEY!;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    if (!signatureHeader) {
      console.warn(
        "[WEBHOOK] Отсутствует заголовок подписи. Пропускаем проверку для отладки."
      );
    } else if (signatureHeader !== computedSignature) {
      console.warn("[WEBHOOK] Недопустимая подпись", { signatureHeader, computedSignature });
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Парсим тело запроса после проверки или предупреждения
    const payload = JSON.parse(bodyText);
    console.log("[WEBHOOK] Получен webhook:", payload);

    const event = payload.event;
    const payment = payload.object;
    const metadata = payment?.metadata || {};

    const purchaseId = metadata.purchaseId;
    const userId = metadata.userId;
    const amount = parseInt(metadata.amount);
    const paymentId = payment?.id;

    if (!purchaseId || !userId || !paymentId) {
      console.warn("[WEBHOOK] Недостаточно данных");
      return NextResponse.json({ success: true });
    }

    if (event === "payment.succeeded") {
      console.log("[WEBHOOK] Событие: оплата успешна");
      // Убедитесь, что purchaseId соответствует тому, что хранится в Convex.
      await convex.mutation(api.creditPurchases.markAsCompleted, { purchaseId, paymentId });
      await convex.mutation(api.userCredits.addCredits, { userId, amount });
    }

    if (event === "payment.canceled") {
      console.log("[WEBHOOK] Событие: платёж отменён");
      await convex.mutation(api.creditPurchases.markAsCanceled, { purchaseId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WEBHOOK] Ошибка при обработке:", error);
    // Даже при возникновении ошибки возвращаем 200, чтобы избежать повторных уведомлений
    return NextResponse.json({ success: true });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
