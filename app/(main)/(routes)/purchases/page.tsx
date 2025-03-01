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

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
})

export default function PurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const aiToolsOrders = useQuery(api.aiToolsOrders.getPaidByUser)
  const payments = useQuery(api.payments.getByUser)
  const tools = useQuery(api.aiTools.get) // Добавляем запрос инструментов
  const isLoading = aiToolsOrders === undefined || payments === undefined || tools === undefined

  // Сортировка по времени (новые сверху)
  const sortedAiToolsOrders = aiToolsOrders?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedPayments = payments?.sort((a, b) => 
    b.createdAt - a.createdAt
  );

  const filteredAiToolsOrders = sortedAiToolsOrders?.filter(order => {
    return order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredPayments = sortedPayments?.filter(payment => 
    payment.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const OrderCard = ({ order, type }: { order: any, type: 'aiTool' | 'payment' }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
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

    if (type === 'aiTool') {
      const { relativeTime, fullDate } = formatDate(order.createdAt);
      
      return (
        <Card className="overflow-hidden hover:shadow-lg transition-all">
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
    }

    // Для Bazarius
    const { relativeTime, fullDate } = formatDate(order.createdAt);
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all">
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

  if ((!aiToolsOrders || aiToolsOrders.length === 0) && (!payments || payments.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Мои покупки</h1>
        <p className="text-muted-foreground">У вас пока нет покупок</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${font.className}`}>
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Все покупки</TabsTrigger>
            <TabsTrigger value="aitools">AI инструменты</TabsTrigger>
            <TabsTrigger value="payments">Bazarius</TabsTrigger>
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

              {/* Показываем Bazarius только если есть покупки */}
              {filteredPayments && filteredPayments.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Bazarius</h2>
                  <div className="space-y-4">
                    {isLoading ? (
                      <SkeletonCards count={2} />
                    ) : (
                      filteredPayments.map(payment => (
                        <OrderCard key={payment._id} order={payment} type="payment" />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Показываем сообщение, если нет покупок */}
              {(!filteredAiToolsOrders?.length && !filteredPayments?.length) && (
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

          <TabsContent value="payments">
            {isLoading ? (
              <SkeletonCards count={4} />
            ) : filteredPayments && filteredPayments.length > 0 ? (
              <div className="space-y-4">
                {filteredPayments.map(payment => (
                  <OrderCard key={payment._id} order={payment} type="payment" />
                ))}
              </div>
            ) : (
              <EmptyState message="У вас пока нет покупок в Bazarius" />
            )}
          </TabsContent>
        </Tabs>
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
