"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"
import { Spinner } from "@/components/spinner"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { toast } from "sonner"

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const service = useQuery(api.aibazargpt.getById, { 
    id: params.id as Id<"aibazargpt"> 
  })
  const createPayment = useMutation(api.payments.create)

  if (!service || !service.details) {
    return (
      <div className="h-full flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  const handlePayment = async () => {
    try {
      if (service.price === "Бесплатно" || typeof service.price !== "number") {
        return;
      }

      const payment = await createPayment({
        serviceId: params.id as Id<"aibazargpt">,
        amount: service.price,
        status: "pending"
      })

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: service.price,
          description: service.title,
          paymentId: payment.id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment')
      }

      const data = await response.json()
      
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url
      } else {
        throw new Error('No confirmation URL received')
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error instanceof Error ? error.message : "Ошибка при создании платежа")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <Link href="/aibazargpt">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>

        {/* Обложка */}
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-8">
          <Image
            src={service.coverImage || service.icon || "/default.png"}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-muted-foreground text-lg mb-8">{service.description}</p>

            {/* Детальное описание */}
            <div className="space-y-8">
              {service.details.overview && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Обзор</h2>
                  <p className="text-muted-foreground">{service.details.overview}</p>
                </div>
              )}

              {/* Возможности */}
              {service.details.capabilities?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Возможности</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.details.capabilities.map((capability, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        {capability.icon && (
                          <div className="relative w-full aspect-[16/9]">
                            <Image
                              src={capability.icon}
                              alt={capability.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                          <p className="text-muted-foreground text-base">{capability.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Требования */}
              {service.details.requirements?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Требования</h2>
                  <ul className="space-y-2">
                    {service.details.requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Примеры использования */}
              {service.details.useCases?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Примеры использования</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {service.details.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Боковая панель */}
          <div>
            <Card className="p-6 sticky top-8">
              <div className="text-3xl font-bold mb-4">
                {service.price === "Бесплатно" ? "Бесплатно" : `${service.price} ₽`}
              </div>
              <Button 
                onClick={handlePayment}
                className="w-full"
              >
                Получить доступ
              </Button>
              <div className="text-sm text-muted-foreground">
                {service.status === "coming_soon" 
                  ? "Мы уведомим вас, когда сервис станет доступен" 
                  : "Мгновенный доступ после оплаты"}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

