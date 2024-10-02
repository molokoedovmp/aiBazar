"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckIcon, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function Services() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");

  const addFeedbackMessage = useMutation(api.feedback.create);
  const services = useQuery(api.services.getAll);

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
      setOpen(true);
    }
  };

  // Filter services based on whether they have a price (assuming pricing plans have prices)
  const generalServices = services?.filter(service => !service.price);
  const pricingPlans = services?.filter(service => service.price);

  return (
    <div className="bg-background min-h-screen">
      {/* Services Grid */}
      <section
        className="mb-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing/circle.png')" }}
      >
        <div className="py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-white">Наши AI услуги</h1>
            <p className="text-xl text-muted-foreground mb-8 text-white">
              Услуги которые мы предоставляем
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-4 py-8 max-w-6xl">
            {[
              {
                title: "Маркетплейс AI моделей",
                description:
                  "На нашем сайте собраны самые интересные модели искуственного интеллекта в разных направлениях. Здесь можно подобрать подходящую модель для вашей задачи.",
                icon: "🤖",
              },
              {
                title: "Разработка кастомных AI решений",
                description:
                  "Индивидуальные AI решения, разработанные для удовлетворения ваших специфических бизнес-потребностей. Например вы можете заказать телеграмм бота ассистента",
                icon: "🛠️",
              },
              {
                title: "Консультации и подбор подходящего чат бота для вас",
                description:
                  "Экспертные советы по интеграции AI в ваши существующие рабочие процессы.",
                icon: "💡",
              },
              {
                title: "Примеры внедрения и использования AI",
                description:
                  "В сообществе вы сможете увидеть решения, созданные другими людьми с помощью искусственного интеллекта, и узнать что-то новое для себя.",
                icon: "📚",
              },
              {
                title: "Доступ к сообществу",
                description:
                  "Присоединяйтесь к активному сообществу профессионалов, разработчиков и экспертов в области AI.",
                icon: "🌐",
              },
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
        </div>
      </section>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Pricing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Список услуг</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans?.map((plan, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription className="text-2xl font-bold">{plan.price} руб.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckIcon className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full text-xs py-1" asChild>
                    <Link href={`/payment`} className="flex items-center justify-center h-8">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      <span className="font-medium">Купить</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Alert Dialog */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
