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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative py-16">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/landing/circle.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              AI Услуги для вашего бизнеса
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Инновационные решения на базе искусственного интеллекта
            </p>
          </div>

          {/* General Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {GENERAL_SERVICES.map((service, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border border-primary/10 bg-gradient-to-b from-card/50 to-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {service.icon && <service.icon className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
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
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Тарифные планы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans?.map((plan, index) => (
              <Card 
                key={index} 
                className="relative group border border-primary/10 bg-gradient-to-b from-card/90 to-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative pb-0">
                  <div className="mb-6">
                    <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
                    <CardDescription className="text-2xl font-semibold text-primary">
                      {plan.price} ₽
                    </CardDescription>
                  </div>
                  <p className="text-muted-foreground/90">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex gap-3 pt-6">
                  <Button 
                    className="flex-1 bg-primary/90 hover:bg-primary" 
                    size="lg"
                    asChild
                  >
                    <Link href="/payment" className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Купить
                    </Link>
                  </Button>
                  {plan.url && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-primary/20 hover:bg-primary/10"
                      asChild
                    >
                      <Link href={plan.url} className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Подробнее
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
