"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function ReviewForm() {
  const { documentId } = useParams();
  const [newReview, setNewReview] = useState({ author: "", content: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");

  const createReview = useMutation(api.reviews.createReview);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createReview({
        documentId: documentId as Id<"documents">,
        author: newReview.author,
        content: newReview.content,
        rating: newReview.rating,
      });

      setDialogTitle("Отзыв отправлен!");
      setDialogDescription("Ваш отзыв успешно отправлен.");
      setNewReview({ author: "", content: "", rating: 5 }); // Reset form
    } catch (error) {
      setDialogTitle("Ошибка!");
      setDialogDescription("Произошла ошибка при отправке отзыва.");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
      setOpen(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleReviewSubmit} className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Оставить отзыв</h3>
        <Input
          placeholder="Ваше имя"
          value={newReview.author}
          onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
          className="mb-4"
          required
        />
        <Textarea
          placeholder="Ваш отзыв"
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          className="mb-4"
          required
        />
        <div className="flex items-center mb-4">
          <span className="mr-2">Рейтинг:</span>
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-6 h-6 cursor-pointer ${i < newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
            />
          ))}
        </div>
        <Button type="submit" className="w-auto px-6" disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить отзыв"}
        </Button>
      </form>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="text-left">
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)}>Закрыть</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}