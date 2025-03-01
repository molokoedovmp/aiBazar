'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ArrowLeft } from "lucide-react";

const SERVICES = [
  { id: 'chatgpt', name: 'ChatGPT', price: 3000 },
  { id: 'midjourney', name: 'Midjourney', price: 2500 },
  { id: 'claude', name: 'Claude', price: 3500 },
];

export default function AIToolsPaymentPage() {
  const router = useRouter();
  const createOrder = useMutation(api.aiToolsOrders.create);
  
  const [formData, setFormData] = useState({
    serviceType: '',
    details: '',
    contactInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedService = SERVICES.find(s => s.id === formData.serviceType);
      if (!selectedService) return;

      const order = await createOrder({
        serviceId: selectedService.id as any, // Временное решение, нужно будет типизировать правильно
        details: formData.details,
        contactInfo: formData.contactInfo,
        amount: selectedService.price,
        status: 'pending'
      });

      // Создаем платеж в ЮKassa
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedService.price,
          description: `Оплата ${selectedService.name}`,
          paymentId: order
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

  return (
    <div className="min-h-screen bg-background pt-[72px] px-4">
      {/* Кнопка "Назад" как часть основного контента */}
      <div className="max-w-xl mx-auto mb-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
      </div>

      {/* Основная карточка */}
      <Card className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold mb-4">Оформление заказа AI Tools</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Выберите сервис</label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({...formData, serviceType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите сервис" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.price} ₽
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Детали заказа</label>
              <Textarea
                placeholder="Опишите подробности вашего заказа"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Контактная информация</label>
              <Input
                placeholder="Telegram/Email/Phone"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
              />
            </div>
          </CardContent>

          <CardFooter className="p-6">
            <Button type="submit" className="w-full">
              Перейти к оплате
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 