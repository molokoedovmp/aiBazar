"use client"

import { useUser } from "@clerk/clerk-react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, MessageCircle, AlertTriangle, Bot } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface PaymentDialogProps {
  price: number | "Бесплатно"
  children: React.ReactNode
  title?: string
  tool: any
}

export function PaymentDialog({ price, children, title, tool }: PaymentDialogProps) {
  const router = useRouter()
  const { isSignedIn } = useUser()

  const handleWebsitePayment = () => {
    if (!isSignedIn) {
      toast.error('Для оплаты на сайте необходимо авторизоваться');
      return;
    }
    
    if (!tool?._id) {
      toast.error('Ошибка: ID инструмента не найден');
      return;
    }
    
    const encodedId = encodeURIComponent(tool._id);
    router.push(`/payment?toolId=${encodedId}`);
  }

  const handleTelegramPayment = () => {
    window.open("https://t.me/aibazaru", "_blank")
  }

  const handleTelegramBotPayment = () => {
    window.open("https://t.me/AnonPaySubBot", "_blank")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Оплата {tool.name}</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {tool.description}
          </p>
          <p className="text-sm font-medium text-primary mt-1">
            Стоимость: {typeof price === "number" ? `${price} ₽` : price}
          </p>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* <Button 
            onClick={handleTelegramBotPayment}
            className="h-14 text-base bg-green-600 hover:bg-green-700 transition-colors justify-start"
            size="lg"
          >
            <div className="flex items-center gap-3">
              <Bot size={20} />
              <div className="text-left">
                <div>Оплатить через Telegram бота</div>
                <div className="text-sm opacity-80 font-normal">Новая функция в тестировании</div>
              </div>
            </div>
          </Button> */}
          
          <Button 
            onClick={handleTelegramPayment}
            className="h-14 text-base bg-blue-600 hover:bg-blue-700 transition-colors justify-start"
            size="lg"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <div className="text-left">
                <div>Оплатить через Telegram</div>
                <div className="text-sm opacity-80 font-normal">Чат с менеджером</div>
              </div>
            </div>
          </Button>
          
          <div>
            {!isSignedIn && (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 text-sm mb-2">
                <AlertTriangle size={16} />
                <span>Для оплаты на сайте необходимо авторизоваться</span>
              </div>
            )}
            <Button 
              onClick={handleWebsitePayment}
              variant="outline"
              className="h-14 text-base border-2 hover:bg-primary/5 transition-colors justify-start text-primary border-primary/20 w-full"
              size="lg"
              disabled={!isSignedIn}
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={20} />
                <div className="text-left">
                  <div>Оплатить на сайте</div>
                  <div className="text-sm opacity-80 font-normal">Обработка заявки займет до 24 часов</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Отмена</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}