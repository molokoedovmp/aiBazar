"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  
  const onCreate = () => {
    const promise = create({ title: "Без имени" })
      .then((documentId) => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: "Создание новой страницы...",
      success: "Новая страница создана!",
      error: "Ошибка в создании новой страницы."
    });
  };

  return ( 
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Добро пожаловать {user?.fullName}
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Создать страницу
      </Button>
    </div>
   );
}
 
export default DocumentsPage;