'use client';

export const dynamic = 'force-dynamic';  // Добавляем динамическую генерацию страницы

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Poppins } from 'next/font/google';
import { Navbar } from '@/app/(marketing)/_components/navbar'; // Убедитесь, что путь к вашему Navbar правильный

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolId = searchParams.get('toolId');

  const [selectedOption, setSelectedOption] = useState('');

  const handleProceed = () => {
    // Здесь вы можете передать выбранный вариант оплаты ассистенту
    window.location.href = 'https://t.me/aibazaru';
  };

  return (
    <div
      className={`flex flex-col min-h-screen bg-background items-center p-6 ${font.className}`}
    >
      {/* Добавляем Navbar сверху */}
      <Navbar />

      {/* Оборачиваем Card, чтобы центрировать его с учетом Navbar */}
      <div className="flex-1 flex items-center justify-center w-full">
        <Card className="max-w-xl w-full">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Как будет проходить оплата подписки
            </h2>
            <p className="mb-4">Пожалуйста, выберите способ оплаты:</p>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <label htmlFor="option1" className="text-sm flex-1">
                  Отправить нам пароль и логин для входа в аккаунт, и мы оплатим
                  подписку.
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <label htmlFor="option2" className="text-sm flex-1">
                  Отправить нам ссылку на оплату, и мы оплатим.
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="option3" id="option3" />
                <label htmlFor="option3" className="text-sm flex-1">
                  Выбрать новый аккаунт, мы создадим новый аккаунт с подпиской.
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="option4" id="option4" />
                <label htmlFor="option4" className="text-sm flex-1">
                  Другая услуга.
                </label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="p-6">
            <Button
              onClick={handleProceed}
              disabled={!selectedOption}
              className="w-full"
            >
              Продолжить
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
