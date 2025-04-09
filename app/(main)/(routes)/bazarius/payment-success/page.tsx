// app/bazarius/payment-success/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const purchaseId = searchParams.get("purchaseId") || "";
  const purchase = useQuery(api.creditPurchases.getById, { purchaseId });

  useEffect(() => {
    if (!user || !purchase) return;

    if (purchase.status === "completed") {
      setStatus("success");
      setTimeout(() => router.push("/bazarius"), 3000);
    } else if (purchase.status === "canceled") {
      setStatus("error");
    } else {
      setStatus("loading");
    }
  }, [user, purchase, router]);

  return (
    <div className="container mx-auto p-8 max-w-md">
      <div className="bg-card p-8 shadow-md rounded-lg text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12">
              <Spinner />
            </div>
            <h1 className="text-2xl font-bold">Обработка платежа</h1>
            <p className="text-muted-foreground">
              Пожалуйста, подождите. Мы проверяем статус платежа...
            </p>
          </div>
        )}

        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Оплата прошла успешно!</h1>
            <p className="text-muted-foreground">Кредиты начислены на ваш аккаунт.</p>
            <p className="text-sm text-muted-foreground">Сейчас вы будете перенаправлены...</p>
          </motion.div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600">Оплата не была завершена</h1>
            <p className="text-muted-foreground">
              Если вы считаете, что это ошибка — свяжитесь с поддержкой.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
