import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PaymentFailedPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Оплата не удалась</h1>
        <p className="text-muted-foreground mb-4">
          К сожалению, произошла ошибка при оплате. Попробуйте еще раз.
        </p>
        <Link href="/aibazargpt">
          <Button>Вернуться к сервисам</Button>
        </Link>
      </div>
    </div>
  )
} 