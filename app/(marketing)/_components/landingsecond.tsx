import React from 'react';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import TransitionButton from './TransitionButton';
import FeaturePage from './FeatureSection';
import ContentPage from './ContentSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';

// Импортируем новый компонент
import PaymentInstructionSection from './payment-instruction';

// Динамический импорт Spline для отложенной загрузки
const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="animate-pulse text-white text-xl">Загрузка 3D модели...</div>
    </div>
  )
});

export function Landingsecond() {
  const formatPrice = (price?: number) => {
    if (price === undefined || price === 0) return 'Бесплатно'
    return `${price.toLocaleString('ru-RU')} ₽`
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <main className="flex-1">
      <meta name="yandex-verification" content="31f9fbf9bddca189" />
        {/* Hero Section - с оригинальными цветами */}
        <section className="relative w-full min-h-[80vh] overflow-hidden bg-white dark:bg-black">
          {/* Декоративные элементы (звёзды, линии, круги) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Звёзды (видны в обеих темах) */}
            <div>
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute h-1 w-1 bg-black dark:bg-white rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: Math.random() * 0.7 + 0.3
                  }}
                />
              ))}
            </div>
            
            {/* Тонкие линии и круги */}
            <div className="absolute h-64 w-64 border border-gray-200 dark:border-gray-800 rounded-full -top-32 -left-32 opacity-50"></div>
            <div className="absolute h-96 w-96 border border-gray-200 dark:border-gray-800 rounded-full -bottom-48 -right-48 opacity-50"></div>
            <div className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent top-1/4 left-0"></div>
            <div className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent bottom-1/4 right-0"></div>
          </div>
          
          {/* Основной контент */}
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            {/* Верхняя метка */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 mb-6 w-fit">
              AI-инструменты и сервисы
            </div>
            
            {/* Двухколоночный макет */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Левая колонка с текстом */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-black dark:text-white">
                  Мощь AI <span className="text-black dark:text-white">под вашим</span> контролем
                </h1>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                  Всё в одном месте
                </h2>
                <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
                  Здесь собрана большая библиотека из AI инструментов для решения ваших задач. Всё в одном месте.
                </p>
                
                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <TransitionButton
                    size="lg"
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-lg px-8 py-4 rounded-full flex items-center justify-center shadow-lg w-full sm:w-auto"
                    path="/bazar"
                  >
                    Смотреть <ArrowRight className="ml-2 h-5 w-5" />
                  </TransitionButton>
                  <TransitionButton
                    size="lg"
                    className="bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900 text-lg px-8 py-4 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 w-full sm:w-auto"
                    path="/blog"
                  >
                    Сообщество
                  </TransitionButton>
                </div>
                
                {/* Иконки функций */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">AI Контент</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Безопасность</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Быстрый доступ</span>
                  </div>
                </div>
              </div>
              
              {/* Правая колонка с 3D моделью */}
              <div className="relative h-[500px] md:h-[550px] lg:h-[600px] order-first lg:order-last">
                {/* Декоративная рамка вокруг робота */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[90%] h-[90%] border border-gray-200 dark:border-gray-800 rounded-full opacity-30"></div>
                  </div>
                </div>
                
                {/* Декоративные элементы */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full opacity-70 z-0"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full opacity-70 z-0"></div>
                
                {/* Декоративные линии */}
                <div className="absolute top-1/4 -left-4 w-8 h-1 bg-gray-200 dark:bg-gray-800 rounded-full opacity-60 z-0"></div>
                <div className="absolute bottom-1/4 -right-4 w-8 h-1 bg-gray-200 dark:bg-gray-800 rounded-full opacity-60 z-0"></div>
                
                {/* Светящиеся точки */}
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 dark:bg-purple-600 rounded-full opacity-70 z-0 animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded-full opacity-70 z-0 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-red-400 dark:bg-red-600 rounded-full opacity-70 z-0 animate-pulse" style={{animationDelay: '1.5s'}}></div>
                
                {/* Градиентный фон за роботом */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="w-[90%] h-[90%] rounded-full bg-gradient-to-br from-purple-50 via-transparent to-blue-50 dark:from-purple-900/20 dark:via-transparent dark:to-blue-900/20 opacity-60 blur-xl"></div>
                </div>
                
                {/* 3D модель робота - увеличиваем размер и добавляем закругление */}
                <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden rounded-3xl">
                  <Spline
                    scene="https://prod.spline.design/xasN6jN3w1ggRc6p/scene.splinecode"
                    className="w-[110%] h-[110%] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Instruction Section - с отрицательным margin для уменьшения расстояния */}
        <section className="relative -mt-16">
          <PaymentInstructionSection />
        </section>

        {/* Designer Services Section */}
        <section className="relative py-12 bg-white dark:bg-black">
          <div className="relative z-10">
            <ContentPage />
          </div>
        </section>

        {/* Featured AI Products Section */}
        <section className="relative py-12 bg-gray-50 dark:bg-black">
          {/* Тонкие круги для визуального интереса */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute h-64 w-64 border border-gray-200 dark:border-gray-800 rounded-full -top-32 -left-32"></div>
            <div className="absolute h-96 w-96 border border-gray-200 dark:border-gray-800 rounded-full -bottom-48 -right-48"></div>
          </div>
          
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tяёight sm:text-5xl md:text-6xl">
                  Наиболее популярные AI
                </h2>
                <p className="max-w-3xl text-lg md:text-xl mx-auto text-gray-700 dark:text-gray-300">
                  Откройте для себя новейшие и самые инновационные инструменты и сервисы искусственного интеллекта.
                </p>
              </div>
            </div>
            <FeaturePage />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-24 bg-white dark:bg-black">
          {/* Тонкие диагональные линии для визуального интереса */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent top-1/4"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent bottom-1/4"></div>
            <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent left-1/4"></div>
            <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent right-1/4"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 pb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              Часто задаваемые вопросы
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question:
                      'Как осуществляется оплата за подписку на Ai инструменты?',
                    answer:
                      'Оплата подписки и услуг осуществляется через безопасные платежные системы. Вы можете выбрать удобный для вас способ оплаты, включая банковские карты, электронные кошельки и другие методы.',
                  },
                  {
                    question:
                      'Как работает услуга по разработке кастомных AI решений?',
                    answer:
                      'Наша услуга по разработке кастомных AI решений начинается с консультации для понимания ваших специфических потребностей. Затем мы разрабатываем и внедряем индивидуальное AI решение для вашего бизнеса. Это может включать создание кастомных моделей, интеграцию AI в ваши существующие системы или разработку полностью новых AI приложений.',
                  },
                  {
                    question: 'Какие преимущества я получу, присоединившись к сообществу?',
                    answer:
                      'Присоединившись к нашему сообществу, вы получите доступ к реальным примерам использования AI, сможете обмениваться опытом с другими участниками, получать советы от экспертов и находить вдохновение для внедрения AI в своем бизнесе.',
                  },
                  {
                    question: 'Как мне понять, какой именно AI мне нужен?',
                    answer:
                      'Вы можете связаться с менеджером в телеграм-чате, и он посоветует вам подходящие решения по вашим пожеланиям.',
                  },
                ].map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <AccordionTrigger className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300 pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
