import { ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline/next';
import TransitionButton from './TransitionButton';
import FeaturePage from './FeatureSection';
import ContentPage from './ContentSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Импортируйте новый компонент
import HowItWorksSection from './steps';

export function Landingsecond() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-screen overflow-hidden">
          <Spline
            scene="https://prod.spline.design/xasN6jN3w1ggRc6p/scene.splinecode"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
          <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center px-4 md:px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Мощь AI под вашим контролем
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Здесь собрана большая библиотека из AI инструментов.
            </p>
            <TransitionButton
              size="lg"
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 rounded-full flex items-center"
              path="/bazar"
            >
              Смотреть <ArrowRight className="ml-2 h-5 w-5" />
            </TransitionButton>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              О нашем сайте
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white">
              Мы предоставляем доступ к передовым AI инструментам, позволяя вам использовать их мощь для решения ваших задач. Наша платформа объединяет лучшие технологии искусственного интеллекта в одном месте.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Designer Services Section */}
          {/* <ContentPage /> */}
        <section className="relative py-12 md:py-24 lg:py-32 bg-muted">
          <img
            src="/landing/crev.png"
            alt="Featured AI Products"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-10">
          <ContentPage />
          </div>
        </section>

        {/* Featured AI Products Section */}
        <section className="relative py-12 md:py-24 lg:py-32 bg-muted">
          <img
            src="/landing/circle.png"
            alt="Featured AI Products"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-10 container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-white text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Наиболее популярные AI
                </h2>
                <p className="text-white max-w-3xl text-lg md:text-xl">
                  Откройте для себя новейшие и самые инновационные инструменты и сервисы искусственного интеллекта.
                </p>
              </div>
            </div>
            <FeaturePage />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-12 md:py-24 lg:py-32 bg-black">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          ></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 pb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
              Часто задаваемые вопросы
            </h2>
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
                  question: 'Как мне понять какой именно мне нужен AI?',
                  answer:
                    'Вы можете связаться с менеджером в телеграмм чате и он посоветует вам подходящие решения по вашим пожеланиям.',
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-gray-700"
                >
                  <AccordionTrigger className="text-white hover:text-gray-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>  
          <div
            className="py-16 bg-gray-900 bg-opacity-50 container mx-auto px-4 md:px-6 text-center relative z-10"
            style={{ backgroundImage: "url('/landing/metallic.png')", backgroundSize: 'cover', backgroundPosition: 'center', height: '325px' }}
          >
            {/* Добавим затемнение через overlay */}
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
                Готовы начать?
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-white font-bold">
                Присоединяйтесь к нам и используйте все возможности AI сегодня.
              </p>
              <TransitionButton
                size="lg"
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 rounded-full flex items-center mx-auto"
                path="/bazar"
              >
                Присоединиться <ArrowRight className="ml-2 h-5 w-5" />
              </TransitionButton>
            </div>
          </div>


        </section>

      </main>
    </div>
  );
}
