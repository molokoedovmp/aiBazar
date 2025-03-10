"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, ShoppingCart, ExternalLink, Bot, Wrench, MessageSquareMore, BookOpen, Users, HelpCircle } from "lucide-react";
import { Icon } from '@iconify/react';
import Link from "next/link";

const GENERAL_SERVICES = [
  {
    title: "Маркетплейс AI моделей",
    description: "На нашем сайте собраны самые интересные модели искуственного интеллекта в разных направлениях. Здесь можно подобрать подходящую модель для вашей задачи.",
    icon: Bot,
  },
  {
    title: "Разработка кастомных AI решений",
    description: "Индивидуальные AI решения, разработанные для удовлетворения ваших специфических бизнес-потребностей. Например вы можете заказать телеграмм бота ассистента",
    icon: Wrench,
  },
  {
    title: "Любая услуга связанная с искусственным интеллектом",
    description: "Если вы хотите получить какую-то услугу связанную с искусственным интеллектом, вы можете обратиться к нам и мы поможем вам с этим.",
    icon: HelpCircle,
  },
  {
    title: "Консультации и подбор подходящего чат бота для вас",
    description: "Экспертные советы по интеграции AI в ваши существующие рабочие процессы.",
    icon: MessageSquareMore,
  },
  {
    title: "Примеры внедрения и использования AI",
    description: "В сообществе вы сможете увидеть решения, созданные другими людьми с помощью искусственного интеллекта, и узнать что-то новое для себя.",
    icon: BookOpen,
  },
  {
    title: "Доступ к сообществу",
    description: "Присоединяйтесь к активному сообществу профессионалов, разработчиков и экспертов в области AI.",
    icon: Users,
  }
];

export default function Services() {
  const services = useQuery(api.services.getAll);
  const pricingPlans = services?.filter(service => service.price);

  return (
    <div className="min-h-screen relative">
      {/* Декоративные линии */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div className="absolute top-0 left-1/4 w-px h-screen bg-gradient-to-b from-transparent via-primary/10 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-screen bg-gradient-to-b from-transparent via-primary/10 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16">
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground dark:text-white">
              AI Услуги для вашего бизнеса
            </h1>
            <p className="text-xl text-foreground/80 dark:text-white/80 max-w-2xl mx-auto">
              Инновационные решения на базе искусственного интеллекта
            </p>
          </div>

          {/* General Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {GENERAL_SERVICES.map((service, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border border-primary/10 bg-card/80 dark:bg-black/40 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {service.icon && <service.icon className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-3 text-foreground dark:text-white">{service.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed text-foreground/80 dark:text-white/80">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative mt-12">
        <div className="relative container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Тарифные планы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans?.map((plan, index) => (
              <Card 
                key={index} 
                className="relative group border border-primary/10 bg-card/80 dark:bg-black/40 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <CardHeader className="relative pb-0">
                  <div className="mb-6">
                    <CardTitle className="text-2xl mb-2 text-foreground dark:text-white">{plan.title}</CardTitle>
                    <CardDescription className="text-2xl font-semibold text-primary">
                      {plan.price} ₽
                    </CardDescription>
                  </div>
                  <p className="text-muted-foreground/90 dark:text-white/70">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-6 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90 dark:text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex gap-3 pt-6 mt-auto relative z-20">
                  <Button 
                    className="w-full bg-primary/90 hover:bg-primary flex items-center justify-center gap-2 relative z-20" 
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation(); // Останавливаем всплытие события
                      window.open('https://t.me/aibazaru', '_blank');
                    }}
                  >
                    <MessageSquareMore className="w-4 h-4" />
                    Написать
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
