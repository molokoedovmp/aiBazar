'use client'

import { useState } from "react";
import {
  Check,
  ArrowRight,
  Info,
  X,
  FileText,
  Building,
  ShoppingBag,
  Megaphone,
  Store,
  Search,
  BarChart,
  Palette,
  ImageIcon,
  HelpCircle,
  Settings,
  Database
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const WebsiteServicesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [activeTab, setActiveTab] = useState("websites");
  
  const submitFeedback = useMutation(api.feedback.create);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitFeedback({
        name,
        email,
        message,
        service: selectedService
      });
      
      toast.success("Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.");
      
      setIsDialogOpen(false);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      toast.error("Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openOrderDialog = (serviceName: string) => {
    setSelectedService(serviceName);
    setMessage(`Меня интересует услуга: ${serviceName}`);
    setIsDialogOpen(true);
  };

  // Общие преимущества для всех тарифов
  const commonFeatures = [
    "Оптимизированная скорость загрузки и отсутствие лимитов по трафику (не для файлообменников)",
    "Надежная защита: антивирусные меры, фильтрация спама, серверы на территории РФ",
    "Регулярное резервное копирование для сохранности ваших данных и быстрого восстановления",
    "Круглосуточная поддержка по любым вопросам через удобные каналы связи"
  ];

  // Типы веб-сайтов
  const websiteTypes = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Одностраничные сайты (Лендинги)",
      services: [
        {
          name: "Лендинг Пейдж",
          description: "Эффективный одностраничный сайт, сфокусированный на конверсии. Идеален для быстрого запуска и продвижения конкретного продукта или услуги.",
          price: "14 950 ₽",
          details: "Отличное решение для презентации одного товара или услуги. Структура страницы разработана для максимального вовлечения и стимулирования целевого действия, особенно эффективно при использовании платной рекламы."
        }
      ]
    },
    {
      icon: <Building className="h-5 w-5" />,
      title: "Корпоративные сайты",
      services: [
        {
          name: "Сайт на базе готового шаблона",
          description: "Экономичный вариант с оперативным запуском. Выбирайте из 250+ дизайнов, возможность расширения до 450 страниц. Запуск за 3-5 дней.",
          price: "17 950 ₽",
          details: "Выберите подходящий дизайн из нашего обширного каталога готовых решений. Мы предлагаем множество вариантов для различных сфер бизнеса."
        },
        {
          name: "Эксклюзивный шаблонный сайт",
          description: "Готовое решение, которое будет только у вас. После покупки шаблон снимается с продажи. Запуск за 3-7 дней.",
          price: "19 950 ₽",
          details: "Профессиональный дизайн, созданный для конкретной ниши. Как только вы его приобретаете, он становится недоступным для других клиентов."
        },
        {
          name: "Индивидуальная разработка",
          description: "Создаем сайт с нуля по вашему техническому заданию, учитывая все цели, задачи и фирменный стиль. Срок разработки: 14-28 дней.",
          price: "от 35 000 ₽",
          details: "Полностью кастомизированное решение. Мы учтем все ваши требования, особенности бизнеса и предоставим уникальный дизайн. Возможно использование ваших бренд-материалов."
        }
      ]
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Интернет-магазины",
      services: [
        {
          name: "Стандартный интернет-магазин",
          description: "Функциональный магазин для старта онлайн-продаж, рассчитанный на каталог до 5000 позиций.",
          price: "19 950 ₽",
          details: "Включает каталог до 5000 товаров, корзину, настройку скидок, опций доставки и платежных систем. Оптимальный набор для начала электронной коммерции."
        },
        {
          name: "Расширенный интернет-магазин",
          description: "Магазин с каталогом до 15 000 товаров и расширенным функционалом для повышения удобства и продаж.",
          price: "29 950 ₽",
          details: "Поддерживает до 15 000 товаров, умный поиск, интеграцию с 1С/МойСклад, бонусную программу, маркетинговые инструменты, мультиссылку и 15+ других дополнений для роста вашего бизнеса."
        },
        {
          name: "Магазин по индивидуальному проекту",
          description: "Разработка уникального интернет-магазина с нуля под ваши специфические требования.",
          price: "от 35 000 ₽",
          details: "Создание эксклюзивного дизайна и функционала, полностью соответствующего вашим бизнес-процессам и целям."
        }
      ]
    },
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Контент и Маркетинг",
      services: [
        {
          name: "Комплексное наполнение сайта",
          description: "Полная подготовка сайта к запуску: маркетинговый анализ, тексты, SEO, добавление товаров. Мы берем на себя всю работу по контенту.",
          price: "от 79 950 ₽",
          details: "Идеально для тех, кто хочет получить готовый к работе сайт с минимальным личным участием. Мы проведем исследование, напишем контент, оптимизируем его и наполним каталог."
        }
      ]
    }
  ];

  // Услуги для маркетплейсов
  const marketplaceServices = [
    {
      icon: <Store className="h-5 w-5" />,
      title: "Выход на маркетплейсы",
      description: "Начните продавать на ведущих онлайн-площадках и многократно увеличьте охват аудитории.",
      price: "Бесплатно (подключение)",
      details: "Само подключение бесплатно, ежемесячное обслуживание составляет 1950 ₽. Предоставляем удобный инструмент для централизованного управления продажами на маркетплейсах."
    }
  ];

  // Услуги по продвижению
  const promotionServices = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Настройка контекстной рекламы (Яндекс.Директ)",
      price: "от 9 900 ₽",
      details: "Глубокий анализ конкурентов и вашего предложения для создания максимально эффективной рекламной кампании. Ожидаемый рост конверсии в 2-3 раза!"
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Ведение контекстной рекламы (Яндекс.Директ)",
      price: "от 14 900 ₽",
      details: "Постоянное управление и оптимизация ваших рекламных кампаний в Яндекс.Директ. Регулярная отчетность и работа над повышением ROI."
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Поисковая оптимизация (SEO)",
      price: "24 900 ₽",
      details: "Приведение сайта в соответствие с требованиями поисковых систем, оптимизация под релевантные запросы для увеличения органического трафика."
    },
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Комплексное интернет-продвижение",
      price: "от 39 900 ₽",
      details: "Индивидуальная стратегия продвижения, включающая SEO, контекстную рекламу, контент-маркетинг и другие каналы, подобранные под ваши цели и бюджет."
    }
  ];

  // Дополнительные услуги
  const additionalServices = [
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Создание логотипа",
      price: "от 4 900 ₽",
      details: "Доступный способ получить качественный логотип. Выберите вариант из нашего каталога, и мы адаптируем его под ваш фирменный стиль и цветовую гамму."
    },
    {
      icon: <ImageIcon className="h-5 w-5" />,
      title: "Дизайн продающего баннера",
      price: "от 1 900 ₽",
      details: "Качественный баннер может существенно повысить эффективность рекламы и продаж. Посмотрите примеры наших работ или обсудите задачу с менеджером."
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "Разработка квиз-формы",
      price: "от 4 900 ₽",
      details: "Интерактивные квизы помогают вовлечь посетителей, собрать больше заявок и удержать тех, кто собирался покинуть сайт."
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Настройка веб-аналитики",
      price: "от 3 900 ₽",
      details: "Установка и настройка Яндекс.Метрики и Google Analytics для точного отслеживания посещаемости, поведения пользователей и эффективности рекламы."
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Интеграция с CRM-системами",
      price: "от 5 900 ₽",
      details: "Свяжем ваш сайт с CRM для автоматизации обработки заявок, улучшения работы с клиентами и повышения конверсии."
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Техническое сопровождение",
      price: "от 4 900 ₽/мес",
      details: "Обеспечение стабильной работы сайта: обновления, исправление ошибок, резервное копирование, добавление нового контента и функционала по запросу."
    }
  ];

  // Часто задаваемые вопросы (FAQ)
  const faqs = [
    {
      question: "Какие сроки создания сайта?",
      answer: "Сроки зависят от типа и сложности проекта. Лендинг обычно готов за 3-5 дней, сайт на шаблоне — 5-7 дней. Индивидуальная разработка может потребовать от 2 недель до нескольких месяцев."
    },
    {
      question: "Что включено в базовую стоимость разработки?",
      answer: "Стандартный пакет включает разработку дизайна (или адаптацию шаблона), верстку, программирование основного функционала, базовую SEO-настройку, тестирование и запуск. Дополнительные работы (контент, интеграции, реклама) оплачиваются отдельно."
    },
    {
      question: "Возможно ли внести правки в дизайн после запуска?",
      answer: "Да, мы можем доработать дизайн после запуска сайта. Стоимость таких правок будет зависеть от их объема и сложности."
    },
    {
      question: "Вы предоставляете услуги хостинга?",
      answer: "Да, мы предлагаем надежный хостинг для сайтов, разработанных у нас. Условия и стоимость хостинга обсуждаются индивидуально и могут быть включены в пакет технической поддержки."
    },
    {
      question: "Каков порядок оплаты?",
      answer: "Стандартная схема работы — предоплата 50% от общей стоимости проекта. Оставшиеся 50% оплачиваются после завершения всех работ и вашего финального утверждения сайта."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 pt-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 notion-heading">
          Разработка и Продвижение Веб-сайтов
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Предлагаем полный спектр услуг по созданию сайтов: от простых лендингов
          до сложных интернет-магазинов и корпоративных порталов.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="w-full grid grid-cols-3 p-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <TabsTrigger 
            value="websites" 
            className="py-3 px-4 rounded-none border-r border-gray-200 dark:border-gray-700 
                       data-[state=active]:bg-white data-[state=active]:text-black 
                       data-[state=active]:dark:bg-white data-[state=active]:dark:text-black 
                       data-[state=inactive]:bg-gray-100 data-[state=inactive]:dark:bg-gray-800 
                       data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-white
                       transition-all"
            style={{
              color: activeTab === "websites" ? "#000000" : (document.documentElement.classList.contains('dark') ? "#ffffff" : "#666666"),
              backgroundColor: activeTab === "websites" ? "#ffffff" : (document.documentElement.classList.contains('dark') ? "#333333" : "#f3f3f3")
            }}
          >
            Веб-сайты
          </TabsTrigger>
          <TabsTrigger 
            value="marketing" 
            className="py-3 px-4 rounded-none border-r border-gray-200 dark:border-gray-700 
                       data-[state=active]:bg-white data-[state=active]:text-black 
                       data-[state=active]:dark:bg-white data-[state=active]:dark:text-black 
                       data-[state=inactive]:bg-gray-100 data-[state=inactive]:dark:bg-gray-800 
                       data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-white
                       transition-all"
            style={{
              color: activeTab === "marketing" ? "#000000" : (document.documentElement.classList.contains('dark') ? "#ffffff" : "#666666"),
              backgroundColor: activeTab === "marketing" ? "#ffffff" : (document.documentElement.classList.contains('dark') ? "#333333" : "#f3f3f3")
            }}
          >
            Продвижение
          </TabsTrigger>
          <TabsTrigger 
            value="additional" 
            className="py-3 px-4 rounded-none
                       data-[state=active]:bg-white data-[state=active]:text-black 
                       data-[state=active]:dark:bg-white data-[state=active]:dark:text-black 
                       data-[state=inactive]:bg-gray-100 data-[state=inactive]:dark:bg-gray-800 
                       data-[state=inactive]:text-gray-700 data-[state=inactive]:dark:text-white
                       transition-all"
            style={{
              color: activeTab === "additional" ? "#000000" : (document.documentElement.classList.contains('dark') ? "#ffffff" : "#666666"),
              backgroundColor: activeTab === "additional" ? "#ffffff" : (document.documentElement.classList.contains('dark') ? "#333333" : "#f3f3f3")
            }}
          >
            Доп. Услуги
          </TabsTrigger>
        </TabsList>
        
        {/* Website Services Tab */}
        <TabsContent 
          value="websites" 
          className="mt-8 animate-fade-in"
        >
          {websiteTypes.map((type, typeIndex) => (
            <div key={typeIndex} className="mb-12 animate-slide-up" style={{ animationDelay: `${typeIndex * 100}ms` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="notion-icon-wrapper">
                  {type.icon}
                </div>
                <h2 className="notion-heading text-xl">{type.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {type.services.map((service, serviceIndex) => (
                  <Card key={serviceIndex} className="notion-card flex flex-col h-full border-notion-border hover:border-notion">
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-2xl font-bold mb-4">{service.price}</p>
                      <p className="text-muted-foreground text-sm">{service.details}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full notion-button"
                        onClick={() => openOrderDialog(service.name)}
                      >
                        Заказать
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          
          {/* Common Features */}
          <div className="bg-notion-muted rounded-lg p-8 mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h2 className="notion-heading text-lg mb-6">Преимущества для всех тарифов</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {commonFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-black p-1 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplace Services */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="notion-icon-wrapper">
                <Store className="h-5 w-5" />
              </div>
              <h2 className="notion-heading text-xl">Интеграция с Маркетплейсами</h2>
            </div>
            
            {marketplaceServices.map((service, index) => (
              <Card key={index} className="notion-card overflow-hidden border-notion-border hover:border-notion">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="notion-icon-wrapper">
                          {service.icon}
                        </div>
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <p className="text-sm">{service.details}</p>
                    </div>
                    <div className="bg-secondary md:w-64 p-6 flex flex-col justify-between">
                      <div>
                        <Badge className="bg-black text-white hover:bg-black/90 mb-2">Подключение бесплатно</Badge>
                        <p className="text-xl font-bold">{service.price}</p>
                      </div>
                      <Button 
                        className="mt-6 notion-button"
                        onClick={() => openOrderDialog(service.title)}
                      >
                        Заказать
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Marketing Services Tab */}
        <TabsContent 
          value="marketing" 
          className="mt-8 animate-fade-in"
        >
          <div className="mb-8">
            <h2 className="notion-heading text-2xl mb-8">Услуги по Продвижению Сайта</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {promotionServices.map((service, index) => (
                <Card key={index} className="notion-card h-full border-notion-border hover:border-notion">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="notion-icon-wrapper">
                        {service.icon}
                      </div>
                      <h3 className="font-semibold">{service.title}</h3>
                    </div>
                    <p className="text-2xl font-bold mb-4">{service.price}</p>
                    <p className="text-muted-foreground text-sm mb-6">{service.details}</p>
                    <Button 
                      className="w-full mt-auto notion-button"
                      onClick={() => openOrderDialog(service.title)}
                    >
                      Заказать
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* CTA Banner */}
          <Card className="bg-black text-white rounded-lg overflow-hidden border-none mb-12">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Хотите сделать ваш сайт удобнее, эффективнее и прибыльнее?</h2>
                <p className="text-gray-300 text-lg mb-6">Время для улучшений!</p>
                <Button 
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 border-none"
                  onClick={() => openOrderDialog("Консультация по улучшению сайта")}
                >
                  Запросить консультацию
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Additional Services Tab */}
        <TabsContent 
          value="additional" 
          className="mt-8 animate-fade-in"
        >
          <div>
            <h2 className="notion-heading text-2xl mb-8">Дополнительные Услуги</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => (
                <Card key={index} className="notion-card flex flex-col h-full border-notion-border hover:border-notion">
                  <CardContent className="p-6 flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="notion-icon-wrapper">
                        {service.icon}
                      </div>
                      <h3 className="font-semibold">{service.title}</h3>
                    </div>
                    <p className="text-2xl font-bold mb-4">{service.price}</p>
                    <p className="text-muted-foreground text-sm">{service.details}</p>
                  </CardContent>
                  <CardFooter className="pt-0 px-6 pb-6">
                    <Button 
                      className="w-full notion-button"
                      onClick={() => openOrderDialog(service.title)}
                    >
                      Заказать
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* FAQ Section */}
      <div className="mt-16 border-t border-notion-border pt-12">
        <h2 className="notion-heading text-2xl mb-8">Часто задаваемые вопросы</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-t-0 border-x-0 border-b border-notion-border"
            >
              <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px] border-notion-border p-0 overflow-hidden">
          <div className="bg-black text-white p-6">
            <DialogTitle className="text-xl">Заявка на услугу</DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Пожалуйста, заполните форму. Мы скоро свяжемся с вами для уточнения деталей.
            </DialogDescription>
          </div>
          
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
              >
                Ваше имя
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться?"
                className="border-notion-border focus-visible:ring-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Контактный Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="border-notion-border focus-visible:ring-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1"
              >
                Комментарий (услуга)
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Уточните детали или задайте вопрос"
                className="border-notion-border focus-visible:ring-black resize-none min-h-[120px]"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-notion-border"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="notion-button"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteServicesPage;
