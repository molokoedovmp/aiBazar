"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

function getUserDisplayName(user: any) {
  if (user.firstName) {
    if (user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName;
  }
  
  if (user.emailAddresses && user.emailAddresses.length > 0) {
    return user.emailAddresses[0].emailAddress;
  }
  
  return "в ваши заметки";
}

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Без имени" })
      .then((documentId) => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: "Создание новой заметки...",
      success: "Заметка создана!",
      error: "Не удалось создать заметку."
    });
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/empty.png"
          height="300"
          width="300"
          alt="Empty"
          className="dark:hidden mx-auto"
        />
        <Image
          src="/empty-dark.png"
          height="300"
          width="300"
          alt="Empty"
          className="hidden dark:block mx-auto"
        />
        <h2 className="text-lg font-medium mt-4">
          Добро пожаловать, {getUserDisplayName(user)}
        </h2>
        <Button onClick={onCreate} className="mt-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          Создать заметку
        </Button>
      </div>
    </div>
  );
}
 
export default DocumentsPage;