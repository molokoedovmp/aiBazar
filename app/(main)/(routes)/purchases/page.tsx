"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Poppins } from "next/font/google"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Spinner } from "@/components/spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
})

export default function PurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const aiToolsOrders = useQuery(api.aiToolsOrders.getPaidByUser)
  const payments = useQuery(api.payments.getByUser)
  const creditPurchases = useQuery(api.creditPurchases.getByUser)
  const tools = useQuery(api.aiTools.get)
  const isLoading = aiToolsOrders === undefined || payments === undefined || tools === undefined || creditPurchases === undefined

  // Сортировка по времени (новые сверху)
  const sortedAiToolsOrders = aiToolsOrders?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedPayments = payments?.sort((a, b) => 
    b.createdAt - a.createdAt
  );
  
  // Сортировка покупок кредитов
  const sortedCreditPurchases = creditPurchases?.sort((a, b) => 
    b.timestamp - a.timestamp
  );

  const filteredAiToolsOrders = sortedAiToolsOrders?.filter(order => {
    return order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredPayments = sortedPayments?.filter(payment => 
    payment.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Фильтрация покупок кредитов
  const filteredCreditPurchases = sortedCreditPurchases?.filter(purchase => 
    "Пакет кредитов".toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Добавляем состояние для AlertDialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogDetails, setDialogDetails] = useState("")
  const [dialogTitle, setDialogTitle] = useState("")

  const OrderCard = ({ order, type }: { order: any, type: 'aiTool' | 'payment' | 'credit' }) => {
    const formatDate = (dateString: string | number) => {
      const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString);
      const relativeTime = formatDistanceToNow(date, {
        addSuffix: true,
        locale: ru
      });
      const fullDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return { relativeTime, fullDate };
    };

    // Обновляем функцию showPaymentDetails для использования AlertDialog
    const showPaymentDetails = () => {
      let details = "";
      let title = "";
      
      if (type === 'aiTool') {
        title = order.serviceName || "Неизвестный сервис";
        details = `
Статус: ${order.status === 'completed' ? 'Завершен' : 'В обработке'}
Сумма: ${order.amount.toLocaleString("ru-RU")} ₽
Дата: ${new Date(order.createdAt).toLocaleDateString('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
ID заказа: ${order._id}
        `;
      } else if (type === 'credit') {
        title = `Пакет кредитов (${order.amount} кредитов)`;
        details = `
Статус: ${order.status === 'completed' ? 'Завершен' : 'В обработке'}
Сумма: ${order.price.toLocaleString("ru-RU")} ₽
Дата: ${new Date(order.timestamp).toLocaleDateString('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
ID заказа: ${order._id}
${order.paymentId ? `ID платежа: ${order.paymentId}` : ''}
        `;
      } else {
        title = order.serviceName || "Неизвестный сервис";
        details = `
Статус: ${order.status === 'completed' ? 'Завершен' : 'В обработке'}
Сумма: ${order.amount.toLocaleString("ru-RU")} ₽
Дата: ${new Date(order.createdAt).toLocaleDateString('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
ID заказа: ${order._id}
        `;
      }
      
      // Устанавливаем данные для диалога и открываем его
      setDialogTitle(title);
      setDialogDetails(details);
      setIsDialogOpen(true);
    };

    if (type === 'aiTool') {
      const { relativeTime, fullDate } = formatDate(order.createdAt);
      
      return (
        <Card 
          className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" 
          onClick={showPaymentDetails}
        >
          <div className="flex p-4 gap-4">
            <div className="w-16 h-16 relative flex-shrink-0 bg-muted rounded-md">
              <Image
                src={order.serviceCover || "/default.png"}
                alt={order.serviceName || "AI Tool"}
                fill
                className="object-cover rounded-md"
                sizes="64px"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {order.serviceName || "Неизвестный сервис"}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <span>{relativeTime}</span>
                    <span className="mx-2">•</span>
                    <span>{fullDate}</span>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}>
                    {order.status === 'completed' ? 'Завершен' : 'В обработке'}
                  </span>
                </div>
                <p className="font-medium text-primary text-lg">
                  {order.amount.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>
          </div>
        </Card>
      );
    } else if (type === 'credit') {
      // Для покупок кредитов
      const { relativeTime, fullDate } = formatDate(order.timestamp);
      return (
        <Card 
          className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" 
          onClick={showPaymentDetails}
        >
          <div className="flex p-4 gap-4">
            <div className="w-16 h-16 relative flex-shrink-0 bg-muted rounded-md">
              <Image
                src="/default.png" // Логотип Bazarius или иконка кредитов
                alt="Пакет кредитов"
                fill
                className="object-cover rounded-md"
                sizes="64px"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    Пакет кредитов ({order.amount} кредитов)
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <span>{relativeTime}</span>
                    <span className="mx-2">•</span>
                    <span>{fullDate}</span>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}>
                    {order.status === 'completed' ? 'Завершен' : 'В обработке'}
                  </span>
                </div>
                <p className="font-medium text-primary text-lg">
                  {order.price.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    // Для Bazarius
    const { relativeTime, fullDate } = formatDate(order.createdAt);
    return (
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" 
        onClick={showPaymentDetails}
      >
        <div className="flex p-4 gap-4">
          <div className="w-16 h-16 relative flex-shrink-0 bg-muted rounded-md">
            <Image
              src={order.serviceCover || "/default.png"}
              alt={order.serviceName || "Сервис"}
              fill
              className="object-cover rounded-md"
              sizes="64px"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {order.serviceName || "Неизвестный сервис"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <span>{relativeTime}</span>
                  <span className="mx-2">•</span>
                  <span>{fullDate}</span>
                </div>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                  order.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                }`}>
                  {order.status === 'completed' ? 'Завершен' : 'В обработке'}
                </span>
              </div>
              <p className="font-medium text-primary text-lg">
                {order.amount.toLocaleString("ru-RU")} ₽
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${font.className}`}>
      {/* Добавляем AlertDialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              <pre className="mt-2 w-full rounded-md bg-slate-100 dark:bg-slate-900 p-4 overflow-auto whitespace-pre-wrap">
                {dialogDetails}
              </pre>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Закрыть</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-2xl font-bold text-primary relative inline-block">
            Мои покупки
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></span>
          </h1>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по покупкам..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="h-full p-4 space-y-4">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center min-h-[200px]">
                <Spinner size="lg" />
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Все покупки</TabsTrigger>
                  <TabsTrigger value="aitools">AI инструменты</TabsTrigger>
                  <TabsTrigger value="credits">Bazarius</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Показываем AI инструменты только если они есть */}
                    {filteredAiToolsOrders && filteredAiToolsOrders.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4">AI инструменты</h2>
                        <div className="space-y-4">
                          {isLoading ? (
                            <SkeletonCards count={2} />
                          ) : (
                            filteredAiToolsOrders.map(order => (
                              <OrderCard key={order._id} order={order} type="aiTool" />
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Показываем покупки кредитов */}
                    {filteredCreditPurchases && filteredCreditPurchases.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Bazarius</h2>
                        <div className="space-y-4">
                          {isLoading ? (
                            <SkeletonCards count={2} />
                          ) : (
                            filteredCreditPurchases.map(purchase => (
                              <OrderCard key={purchase._id} order={purchase} type="credit" />
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Показываем сообщение, если нет покупок */}
                    {(!filteredAiToolsOrders?.length && !filteredCreditPurchases?.length) && (
                      <div className="col-span-2">
                        <EmptyState message="Покупок не найдено" />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="aitools">
                  {isLoading ? (
                    <SkeletonCards count={4} />
                  ) : filteredAiToolsOrders && filteredAiToolsOrders.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAiToolsOrders.map(order => (
                        <OrderCard key={order._id} order={order} type="aiTool" />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="У вас пока нет покупок AI инструментов" />
                  )}
                </TabsContent>

                <TabsContent value="credits">
                  {isLoading ? (
                    <SkeletonCards count={4} />
                  ) : filteredCreditPurchases && filteredCreditPurchases.length > 0 ? (
                    <div className="space-y-4">
                      {filteredCreditPurchases.map(purchase => (
                        <OrderCard key={purchase._id} order={purchase} type="credit" />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="У вас пока нет покупок в Bazarius" />
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SkeletonCards = ({ count }: { count: number }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-grow">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </>
)
