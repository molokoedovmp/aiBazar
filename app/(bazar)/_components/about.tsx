'use client';

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InstagramIcon, SendIcon } from "lucide-react";
import { YandexZenIcon } from "@/components/YandexZenIcon"; // Импортируем иконку Яндекс Дзена
import { useScrollTop } from "@/hooks/use-scroll-top";
import { Spinner } from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

export default function About() {
  const { isAuthenticated, isLoading } = useConvexAuth();
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
      setDialogDescription(
        "Произошла ошибка при отправке сообщения. Авторизируйтесь в системе."
      );
    } finally {
      setIsSubmitting(false);
      setOpen(true);
    }
  };

  const scrolled = useScrollTop();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section with Image and Mission Statement */}
        <section className="relative mb-16 rounded-lg overflow-hidden">
          <img
            src="/default.png"
            alt="AI Community collaboration"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-6">
            <h1 className="text-4xl font-bold mb-4 text-center">aiBazar</h1>
            <p className="text-xl mb-8 text-center max-w-2xl">
              Наша Миссия — Вдохновлять и Раскрывать Потенциал AI в Жизни
              Каждого
            </p>
            <div className="flex items-center gap-x-2">
              {isLoading && <Spinner />}
              {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                  <Button size="sm">Присоединиться к сообществу</Button>
                </SignInButton>
              )}
              {isAuthenticated && !isLoading && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/documents">Войти</Link>
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Mission Description */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Наша цель</h2>
              <p className="text-muted-foreground">
                Наш сайт создан, чтобы объединить сообщество энтузиастов и
                профессионалов, стремящихся раскрыть потенциал искусственного
                интеллекта. Мы предоставляем доступ к уникальным AI инструментам
                и делимся вдохновляющими примерами их использования. Наша цель —
                помочь каждому найти и внедрить лучшие решения для своих задач с
                помощью передовых технологий. Присоединяйтесь к нам, чтобы вместе
                создавать будущее, где AI становится неотъемлемой частью жизни.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Social Media Links */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-left">
            Наши соцсети
          </h2>
          <div className="flex space-x-4">
            <a
              href="https://t.me/aiBazar1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              <SendIcon className="w-6 h-6" />
              <span className="sr-only">Telegram</span>
            </a>
            <a
              href="https://www.instagram.com/aibazaru/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              <InstagramIcon className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://dzen.ru/aibazar?share_to=link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              <YandexZenIcon className="w-6 h-6" />
              <span className="sr-only">Яндекс Дзен</span>
            </a>
          </div>
        </section>

        {/* Feedback Form */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Мы будем рады получить от вас обратную связь
          </h2>
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Имя
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Твое имя"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Почта
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="твой@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Сообщение
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Твое сообщение"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Отправка..." : "Отправить"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Alert Dialog */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Закрыть
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
