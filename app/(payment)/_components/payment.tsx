'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { ArrowLeft } from "lucide-react"
import Image from 'next/image';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolId = searchParams.get('toolId');
  const tool = useQuery(api.aiTools.getById, { aiToolsId: toolId as Id<"aiTools"> });
  const [formData, setFormData] = useState({
    details: '',
    contactInfo: '',
  });
  const createOrder = useMutation(api.aiToolsOrders.create);
  
  // Если нет toolId, показываем ошибку
  if (!toolId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Ошибка</h2>
          <p className="text-muted-foreground mt-2">Инструмент не найден</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tool) {
      toast.error('Ошибка: продукт не найден');
      return;
    }

    try {
      const order = await createOrder({
        serviceId: toolId as Id<"aiTools">,
        details: formData.details,
        contactInfo: formData.contactInfo,
        amount: tool.price as number,
        status: 'processing'
      });

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: tool.price,
          description: `Оплата ${tool.name}`,
          paymentId: order,
          serviceName: tool.name,
          serviceCover: tool.coverImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment error:', errorData);
        throw new Error(errorData.error || 'Payment creation failed');
      }

      const payment = await response.json();
      console.log('Payment response:', payment);
      
      if (payment.confirmation_url) {
        window.location.href = payment.confirmation_url;
      } else {
        throw new Error('No confirmation URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error) {
        toast.error(`Ошибка при создании заказа: ${error.message}`);
      } else {
        toast.error('Произошла неизвестная ошибка');
      }
    }
  };

  if (!tool) {
    return <div>Загрузка...</div>;
  }

  console.log('Tool data:', tool); // Для отладки

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-background">
      <Card className="w-full max-w-xl relative">
        <Button
          variant="ghost"
          className="absolute -top-12 left-0 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-xl font-semibold">Оформление заказа</h2>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="mb-4 rounded-lg overflow-hidden">
                <Image
                  src={tool.coverImage || "/default.png"}
                  alt={tool.name}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover"
                />
              </div>
              <h3 className="font-medium">{tool.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
              <div className="mt-2 text-primary font-semibold">
                Стоимость: {tool.price} ₽
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Детали заказа</label>
              <Textarea
                placeholder="Опишите подробности вашего заказа (например, какой тип аккаунта вам нужен)"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Контактная информация</label>
              <Input
                placeholder="Telegram/Email/Phone"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="p-6">
            <Button type="submit" className="w-full">
              Оплатить {tool.price} ₽
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
