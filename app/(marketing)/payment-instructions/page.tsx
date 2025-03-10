"use client";

import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PaymentInstructionsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Верхняя навигация */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на главную
        </Link>
      </div>

      {/* Заголовок */}
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Как оплатить AI сервисы из России</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Мы предлагаем простое и надежное решение для оплаты подписок на популярные AI сервисы, 
          включая ChatGPT, Midjourney, Claude и другие.
        </p>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-bl-3xl opacity-50"></div>
              <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 relative z-10">
                <Check className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">Гарантия лучшей цены</h3>
              <p className="text-gray-600 dark:text-gray-400 relative z-10">Мы предлагаем конкурентные цены и регулярно мониторим рынок.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-bl-3xl opacity-50"></div>
              <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 relative z-10">
                <Check className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">Быстрая оплата</h3>
              <p className="text-gray-600 dark:text-gray-400 relative z-10">Процесс оплаты занимает всего несколько минут.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-bl-3xl opacity-50"></div>
              <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 relative z-10">
                <Check className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">Профессиональная поддержка</h3>
              <p className="text-gray-600 dark:text-gray-400 relative z-10">Наши специалисты всегда готовы помочь с любыми вопросами.</p>
            </div>
          </div>

          {/* Инструкция по оплате */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Как оплатить AI сервисы из России</h2>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
              
              {/* Табы с вариантами оплаты */}
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button 
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 0 ? 'bg-gray-100 dark:bg-black text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveTab(0)}
                >
                  Вариант 1: Прямая ссылка
                </button>
                <button 
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 1 ? 'bg-gray-100 dark:bg-black text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveTab(1)}
                >
                  Вариант 2: Логин и пароль
                </button>
                <button 
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 2 ? 'bg-gray-100 dark:bg-black text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveTab(2)}
                >
                  Вариант 3: Оплата на сайте
                </button>
              </div>
              
              {/* Содержимое табов */}
              <div className="p-6">
                {activeTab === 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Оплата через прямую ссылку</h3>
                    <div className="space-y-12">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step.png" 
                            alt="Шаг 1" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 1</h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Перейдите на сайт сервиса, который хотите оплатить (например, <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-100 font-medium hover:underline inline-flex items-center">chat.openai.com <ExternalLink className="h-3 w-3 ml-1" /></a>) и нажмите кнопку для оформления подписки.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step2.png" 
                            alt="Шаг 2" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 2</h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            На странице оплаты скопируйте URL из адресной строки браузера.
                          </p>
                          <div className="flex items-center p-3 bg-gray-100 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                            <code className="text-sm flex-1 truncate">https://chat.openai.com/payments/checkout?plan=plus</code>
                            <button 
                              className="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
                              onClick={() => copyToClipboard("https://chat.openai.com/payments/checkout?plan=plus")}
                            >
                              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step3.png" 
                            alt="Шаг 3" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 3</h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Отправьте скопированную ссылку нашему менеджеру в Telegram и укажите:
                          </p>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Сервис, который хотите оплатить</li>
                            <li>Сумму оплаты</li>
                            <li>Валюту оплаты (рубли)</li>
                            <li>Вариант оплаты (прямая ссылка)</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step4.png" 
                            alt="Шаг 4" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 4</h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Получите реквизиты для оплаты от менеджера, проведите оплату и отправьте подтверждение. После проверки платежа, менеджер оформит подписку и предоставит вам доступ.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Предупреждение для варианта 1 */}
                    <div className="bg-gray-900 dark:bg-gray-900 p-4 rounded-xl mt-8 border border-gray-800 dark:border-gray-800">
                      <h4 className="text-lg font-medium mb-2 flex items-center text-white dark:text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Важно
                      </h4>
                      <p className="text-gray-300 dark:text-gray-300">
                        После оплаты вы получите подтверждение от менеджера и сможете пользоваться всеми преимуществами платной версии сервиса.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Оплата через логин и пароль</h3>
                    <div className="space-y-6">
                      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-lg font-medium mb-2">Шаг 1</h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Напишите нашему менеджеру в Telegram и предоставьте:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                          <li>Логин и пароль от вашего аккаунта в сервисе, который хотите оплатить</li>
                          <li>Сервис, который хотите оплатить</li>
                          <li>Сумму оплаты</li>
                          <li>Валюту оплаты (рубли)</li>
                          <li>Вариант оплаты (логин и пароль)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-lg font-medium mb-2">Шаг 2</h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Получите реквизиты для оплаты от менеджера и проведите платеж. После подтверждения оплаты, наш специалист оформит подписку на ваш аккаунт.
                        </p>
                      </div>
                      
                      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h4 className="text-lg font-medium mb-2">Шаг 3</h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          После успешного оформления подписки вы получите уведомление от менеджера. Теперь вы можете пользоваться всеми преимуществами платной версии сервиса.
                        </p>
                      </div>
                    </div>
                    
                    {/* Предупреждение для варианта 2 */}
                    <div className="bg-gray-900 dark:bg-gray-900 p-4 rounded-xl mt-8 border border-gray-800 dark:border-gray-800">
                      <h4 className="text-lg font-medium mb-2 flex items-center text-white dark:text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Важно
                      </h4>
                      <p className="text-gray-300 dark:text-gray-300">
                        Мы гарантируем полную конфиденциальность ваших данных. Логин и пароль используются только для оформления подписки и не сохраняются в нашей системе.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Оплата через онлайн эквайринг</h3>
                    <div className="space-y-12">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step10.png" 
                            alt="Шаг 1" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 1</h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            Авторизуйтесь в нашей системе. Для оплаты через онлайн эквайринг необходимо иметь активный аккаунт на нашей платформе.
                          </p>
                          <div className="mt-4 p-3 bg-gray-900 dark:bg-gray-900 rounded-lg border border-gray-800 dark:border-gray-800">
                            <p className="text-sm text-gray-300 dark:text-gray-300">
                              <span className="font-medium text-white">Важно:</span> Если у вас еще нет аккаунта, зарегистрируйтесь на нашем сайте перед оплатой.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step11.png" 
                            alt="Шаг 2" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 2</h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            Выберите нужный AI сервис и тариф в каталоге. Нажмите кнопку "Оплатить" на странице выбранного сервиса. После вам необходимо указать следующие данные:
                          </p>
                          
                          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                            <li>Ваш профиль телеграмм</li>
                            <li>Ссылку на оплату сервиса (например, https://chat.openai.com/payments/checkout?plan=plus)</li>
                            <li>Вашу почту</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step12.png" 
                            alt="Шаг 3" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 3</h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            Выберите один из предложенных вариантов оплаты или заполните форму оплаты, введя следующие данные:
                          </p>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                            <li>Номер банковской карты</li>
                            <li>Срок действия карты</li>
                            <li>CVV/CVC-код</li>
                            <li>Имя держателя карты</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-gray-100 dark:bg-black p-6 rounded-xl flex items-center justify-center md:w-1/2 border border-gray-200 dark:border-gray-800">
                          <Image 
                            src="/instruction/step13.png" 
                            alt="Шаг 4" 
                            width={500} 
                            height={300}
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-lg font-medium mb-2">Шаг 4</h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            Подтвердите оплату. В зависимости от вашего банка, может потребоваться дополнительное подтверждение через SMS-код или приложение банка.
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 mt-2">
                            После успешной оплаты вы получите подтверждение на электронную почту, и доступ к выбранному AI сервису будет активирован в течение суток.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Предупреждение для варианта 3 */}
                    <div className="bg-gray-900 dark:bg-gray-900 p-4 rounded-xl mt-8 border border-gray-800 dark:border-gray-800">
                      <h4 className="text-lg font-medium mb-2 flex items-center text-white dark:text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Важно
                      </h4>
                      <p className="text-gray-300 dark:text-gray-300">
                        Для оплаты через онлайн эквайринг необходимо быть авторизованным в системе. Все платежные данные передаются в зашифрованном виде и обрабатываются на защищенных серверах нашего платежного партнера.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-black rounded-2xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 border border-gray-200 dark:border-gray-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border border-gray-200 dark:border-gray-800 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30"></div>
            
            <h2 className="text-3xl font-bold mb-4 relative z-10">Готовы оплатить подписку?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
              Свяжитесь с нашим менеджером прямо сейчас и получите доступ к премиум возможностям AI сервисов.
            </p>
            <Link href="https://t.me/aibazaru" target="_blank" rel="noopener noreferrer">
              <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-lg px-8 py-6 h-auto rounded-full relative z-10">
                Связаться с менеджером
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 