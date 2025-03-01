"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentProcessingPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Платёж обрабатывается</h1>
            <p className="text-muted-foreground">
              Ваш платёж находится в обработке. Это может занять некоторое время.
              Мы уведомим вас о статусе платежа.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/purchases">
              <Button variant="outline" className="w-full">
                Перейти к моим покупкам
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 