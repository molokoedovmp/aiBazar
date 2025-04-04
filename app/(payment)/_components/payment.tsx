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
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from 'next/image';
import { useUser } from "@clerk/clerk-react";
import { Label } from "@/components/ui/label";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolId = searchParams.get('toolId');
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Получаем данные инструмента
  const tool = useQuery(api.aiTools.getById, { aiToolsId: toolId as Id<"aiTools"> });
  
  // Состояние формы с автоматическим заполнением email из Clerk
  const [formData, setFormData] = useState({
    details: '',
    contactInfo: '',
    email: ''  // Новое поле для email
  });
  
  const createOrder = useMutation(api.aiToolsOrders.create);
  
  // Заполняем email из Clerk, когда данные пользователя загружены
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [isLoaded, user]);

  // Заполняем contactInfo из Clerk, когда данные пользователя загружены
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        contactInfo: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [isLoaded, user]);

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
      setIsLoading(true);
      
      const order = await createOrder({
        serviceId: toolId as Id<"aiTools">,
        details: formData.details,
        contactInfo: formData.contactInfo,
        amount: tool.price || 0,
        status: 'processing'
      });

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: tool.price || 0,
          description: `Оплата ${tool.name}`,
          paymentId: order,
          serviceName: tool.name,
          serviceCover: tool.coverImage,
          contactInfo: formData.contactInfo,
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
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем спиннер при загрузке данных
  if (!tool || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

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
                Стоимость: {tool.price ? tool.price.toLocaleString('ru-RU') : 0} ₽
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">Детали заказа</Label>
              <Textarea
                id="details"
                placeholder="Опишите подробности вашего заказа (например, какой тип аккаунта вам нужен)"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                required
              />
              <p className="text-xs text-muted-foreground">
                Укажите ваш Telegram или другой способ связи, чтобы мы могли с вами связаться
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-sm font-medium">Контактная информация</Label>
              <Input
                id="contactInfo"
                placeholder="Telegram/Email/Phone"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="p-6">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-[#3E8BF9] hover:bg-[#2D7DF4] text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Image 
                src="/yookassa.svg" 
                alt="ЮКасса" 
                width={24} 
                height={24} 
                className="h-5 w-auto" 
              />
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Обработка...
                </div>
              ) : (
                `Оплатить ${tool.price ? tool.price.toLocaleString('ru-RU') : 0} ₽`
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
