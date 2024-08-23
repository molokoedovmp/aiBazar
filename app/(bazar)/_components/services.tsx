"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Services() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");

  const addFeedbackMessage = useMutation(api.feedback.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addFeedbackMessage({ name, email, message });
      setDialogTitle("Сообщение отправлено!");
      setDialogDescription("Ваше сообщение успешно отправлено.");
    } catch (error) {
      setDialogTitle("Ошибка!");
      setDialogDescription("Произошла ошибка при отправке сообщения.");
    } finally {
      setIsSubmitting(false);
      setOpen(true); // Открыть диалог
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Наши AI услуги</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Услуги которые мы предоставляем
        </p>
      </section>

      {/* Services Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Маркетплейс AI моделей",
              description: "На нашем сайте собраны самые интересные модели искуственного интеллекта в разных направлениях. Здесь можно подобрать подходящую модель для вашей задачи.",
              icon: "🤖"
            },
            {
              title: "Разработка кастомных AI решений",
              description: "Индивидуальные AI решения, разработанные для удовлетворения ваших специфических бизнес-потребностей. Например вы можете заказать телеграмм бота ассистента",
              icon: "🛠️"
            },
            {
              title: "Консультации и подбор подходящего чат бота для вас",
              description: "Экспертные советы по интеграции AI в ваши существующие рабочие процессы.",
              icon: "💡"
            },
            {
              title: "Примеры внедрения и использования AI",
              description: "В сообществе вы сможете увидеть решения, созданные другими людьми с помощью искусственного интеллекта, и узнать что-то новое для себя.",
              icon: "📚"
            },
            
            {
              title: "Доступ к сообществу",
              description: "Присоединяйтесь к активному сообществу профессионалов, разработчиков и экспертов в области AI.",
              icon: "🌐"
            }
          ].map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-3xl mr-2">{service.icon}</span>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Список услуг</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Оплата подписок",
              price: "от 1000",
              features: ["Выберете нужный вам инструмент", "Посмотрите примеры его работы в сообществе", "Напишите нам в телеграмм и мы оплатим вам подписку", "Оплата происходит следующим образом: вы можете скинуть нам ссылку на оплату или дать логин и пароль от аккаунта и мы сами все сделаем"]
            },
            {
              title: "Создание чат-бота",
              price: "от 1200",
              features: ["Чат бот для обработки клиентов и продажи им услуги / товара", "Чат бот для прослушки и контроля работы колл-центра, отдела продаж", "Чат бот для замены личного ассистента и другие", "Чат бот автоответчик в комментариях/сообщениях соцсесетей"]
            },
            {
              title: "Создание видео для соцсетей",
              price: "от 500",
              features: ["Перевод видео на другие языки", "Создание сценариев и видео", "Монтаж и нарезки видео"]
            },
            {
              "title": "Создание и генерация музыки",
              "price": "от 3000",
              "features": [
                "Генерация оригинальных музыкальных треков по заданным параметрам",
                "Создание фоновой музыки для видео, игр и подкастов",
                "Автоматическое написание мелодий и аккомпанемента"
              ]
            },
            
            {
              "title": "Обработка изображений",
              "price": "от 2000",
              "features": [
                "Автоматическая ретушь и улучшение фотографий",
                "Распознавание объектов на изображениях",
                "Создание фильтров и эффектов для изображений"
              ]
            },
            {
              "title": "Обработка текста и создание контента",
              "price": "от 1500",
              "features": [
                "Генерация текстов на основе заданной тематики",
                "Анализ тональности текстов и отзывов",
                "Автоматическое резюмирование и выделение ключевых моментов"
              ]
            },
            {
              "title": "Голосовые ассистенты и чат-боты",
              "price": "от 2500",
              "features": [
                "Создание голосовых помощников для бизнеса",
                "Интеграция чат-ботов в CRM-системы",
                "Разработка мультиязычных чат-ботов"
              ]
            },
            {
              "title": "Персонализация контента",
              "price": "от 1800",
              "features": [
                "Рекомендательные системы для e-commerce",
                "Персонализация новостных лент и рассылок",
                "Адаптация контента под предпочтения пользователя"
              ]
            },
            {
              "title": "Распознавание речи и преобразование в текст",
              "price": "от 1200",
              "features": [
                "Транскрипция аудио и видеофайлов",
                "Распознавание команд для голосового управления",
                "Создание субтитров для видео"
              ]
            },
            
          ].map((plan, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription className="text-2xl font-bold">{plan.price} руб.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full">{"Начать"}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              question: "Как осуществляется оплата за подписку на Ai инструменты?",
              answer: "Оплата подписки и услуг осуществляется через безопасные платежные системы. Вы можете выбрать удобный для вас способ оплаты, включая банковские карты, электронные кошельки и другие методы."
            },
            {
              question: "Как работает услуга по разработке кастомных AI решений?",
              answer: "Наша услуга по разработке кастомных AI решений начинается с консультации для понимания ваших специфических потребностей. Затем мы разрабатываем и внедряем индивидуальное AI решение для вашего бизнеса. Это может включать создание кастомных моделей, интеграцию AI в ваши существующие системы или разработку полностью новых AI приложений."
            },
            {
              question: "Какие преимущества я получу, присоединившись к сообществу?",
              answer: "Присоединившись к нашему сообществу, вы получите доступ к реальным примерам использования AI, сможете обмениваться опытом с другими участниками, получать советы от экспертов и находить вдохновение для внедрения AI в своем бизнесе."
            },
            {
              question: "Как мне понять какой именно мне нужен AI?",
              answer: "Вы можете связаться с менджером в телеграмм чате и он посоветует вам подходящие решения по вашим пожеланиям."
            }
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      
    </div>
  );
}
