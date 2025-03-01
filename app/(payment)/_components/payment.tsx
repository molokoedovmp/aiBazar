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

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createOrder = useMutation(api.aiToolsOrders.create);
  
  const toolId = searchParams.get('toolId');
  
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

  const tool = useQuery(api.aiTools.getById, { aiToolsId: toolId as Id<"aiTools"> });
  
  const [formData, setFormData] = useState({
    details: '',
    contactInfo: '',
  });

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

      if (!response.ok) throw new Error('Payment creation failed');

      const payment = await response.json();
      
      if (payment.confirmation_url) {
        window.location.href = payment.confirmation_url;
      }
    } catch (error) {
      toast.error('Ошибка при создании заказа');
      console.error(error);
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
                <img 
                  src={tool.coverImage || "/default.png?height=128&width=256"}
                  alt={tool.name}
                  className="w-full h-48 object-cover"
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
