"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

export default function SubmitPage() {
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
      setDialogDescription("Произошла ошибка при отправке сообщения. Авторизируйтесь в системе.");
    } finally {
      setIsSubmitting(false);
      setOpen(true); // Открыть диалог
    }
  };

  const scrolled = useScrollTop();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Feedback Form */}
      <section>
        <Card>
          <CardContent className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="text-left">
                <label htmlFor="name" className="block text-sm font-medium mb-1">Имя</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Твое имя" />
              </div>
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Почта</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="твой@email.com" />
              </div>
              <div className="text-left">
                <label htmlFor="message" className="block text-sm font-medium mb-1">Сообщение</label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Твое сообщение" />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="text-left">
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Закрыть</AlertDialogCancel>
            {/* Optionally add other actions if needed */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
